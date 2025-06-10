use std::net::{TcpStream};
use std::{sync::Arc, net::TcpListener, thread};
use std::io::{self};
use ssh2::Session;

//Credits https://github.com/alexcrichton/ssh2-rs/issues/218#issuecomment-1698814611
pub fn create_tunnel(host_server: String, host_port: u16, remote_server: String, remote_port: u16, session: Arc<Session>) -> Result<(), String> {
    match TcpListener::bind((host_server.as_str(), host_port)) {
        Err(err) => return Err(err.to_string()),
        Ok(listener) => {
            println!("Successfully bound {}:{} on host machine", host_server.as_str(), host_port);
            match session.channel_direct_tcpip(remote_server.as_str(), remote_port, None) {
                Err(err) => return Err(err.to_string()),
                Ok(channel) => {
                    println!("Successfully bound {}:{} on remote machine", host_server.as_str(), host_port);
                    session.set_timeout(10000);
                    session.set_blocking(false);
                    let mut stream_id = 0;

                    tokio::task::spawn_blocking(move || {
                        'listener_loop: loop {
                            match listener.accept() {
                                Err(err) => {
                                    println!("failed to accept connection, reason {:?}", err);
                                    break 'listener_loop;
                                }
                                Ok((stream, socket)) => {
                                    println!("New TCP stream from socket {:}", socket);

                                    let mut reader_stream = stream;
                                    let mut writer_stream = reader_stream.try_clone().unwrap();

                                    let mut writer_channel = { channel.stream(stream_id) };
                                    let mut reader_channel = { channel.stream(stream_id) };
                                    stream_id += 1;

                                    tokio::task::spawn_blocking(move || {
                                        loop {
                                            match io::copy(&mut reader_stream, &mut writer_channel) {
                                                Ok(_) => (),
                                                Err(err) => {
                                                    println!("Failed to write to channel, reason: {:?}", err);
                                                    break;
                                                }
                                            }
                                        }
                                    });

                                    tokio::task::spawn_blocking(move || {
                                        loop {
                                            match io::copy(&mut reader_channel, &mut writer_stream) {
                                                Ok(_) => (),
                                                Err(err) => {
                                                    println!("Failed to read from channel, reason: {:?}", err);
                                                    break;
                                                }
                                            }
                                        }
                                    });
                                }
                            }
                        }

                        println!("Tunnel on {:}:{:}  to {:}:{:} closed!", host_server.as_str(), host_port, remote_server.as_str(), remote_port)
                    });
                }
            }
        }
    };

    Ok(())
}

pub fn run_server() {
    let tcp = TcpStream::connect("172.17.160.1:7022").expect("failed to connect to the server");
    let mut port = 6379;

    {
        let listener = TcpListener::bind("127.0.0.1:0").unwrap();
        port = listener.local_addr().unwrap().port()
    }

    let mut sess = Session::new().expect("failed to create new session");
    sess.set_tcp_stream(tcp);
    sess.handshake().expect("failed to handshake");
    sess.userauth_password("sysadmin", "2663").expect("failed to authenticate");

    println!("{}", &port);

    create_tunnel("0.0.0.0".into(), port, "127.0.0.1".into(), 6379, Arc::new(sess)).expect("TODO: panic message");
}