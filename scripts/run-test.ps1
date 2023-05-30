$Command;

for ( $i = 0; $i -lt $args.count; $i++ ) {
    $Command += "`$Env:" + $args[$i] + "; "
}

$Command += "cargo test --jobs 1 --manifest-path .\src-tauri\Cargo.toml"

Invoke-Expression $Command