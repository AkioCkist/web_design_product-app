const imageInput = document.querySelector('#image');
const imagePreview = document.querySelector('#image-preview');

if (imageInput && imagePreview) {
  imageInput.addEventListener('change', () => {
    const [file] = imageInput.files;
    if (!file) return;
    imagePreview.src = URL.createObjectURL(file);
    imagePreview.hidden = false;
  });
}

const deleteDialog = document.querySelector('#delete-dialog');
const deleteForm = document.querySelector('#delete-form');
const deleteName = document.querySelector('#delete-product-name');

if (deleteDialog && deleteForm && deleteName) {
  document.querySelectorAll('[data-delete-id]').forEach((button) => {
    button.addEventListener('click', () => {
      deleteForm.action = `/admin/products/${button.dataset.deleteId}?_method=DELETE`;
      deleteName.textContent = button.dataset.deleteName;
      deleteDialog.showModal();
    });
  });

  deleteDialog.querySelector('[data-dialog-close]').addEventListener('click', () => deleteDialog.close());
  deleteDialog.addEventListener('click', (event) => {
    if (event.target === deleteDialog) deleteDialog.close();
  });
}
