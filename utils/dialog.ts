// globalny obiekt zarządzający dialogiem
export const DialogContext : {
  setDialogVisibility: (val: boolean) => void,
  setDialogContent: (val: any) => void,
  show:(content: any) => void,
  close: () => any
} = {
  setDialogVisibility: (val) => {},
  setDialogContent: (val) => {},

  show: function (content) {
    this.setDialogContent(content);
    this.setDialogVisibility(true);
  },

  close: function () {
    this.setDialogContent('');
    this.setDialogVisibility(false);
  },
}

export default DialogContext;