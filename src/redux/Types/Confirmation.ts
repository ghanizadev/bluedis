export interface Confirmation {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
}
