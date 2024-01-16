// 点击图片预览
function preview(src){
    // document.getElementById('image-preview').addEventListener('click', function () {
    //     const modal = document.getElementById('modal');
    //     const modalImage = document.getElementById('modal-image');
    //     const imagePreview = document.getElementById('image-preview');
    //
    //     modalImage.src = imagePreview.src;
    //     modal.style.display = 'flex';
    // });

    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modal-image');
    // const imagePreview = document.getElementById('image-preview');

    modalImage.src = src;
    modal.style.display = 'flex';


    document.getElementById('modal').addEventListener('click', function () {
        const modal = document.getElementById('modal');
        modal.style.display = 'none';
    });
}
