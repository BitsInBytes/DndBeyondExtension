function addDownloadButtonToLightbox()
{
    $('#lightbox').append('<div class="lb-dataContainer" style="display: none;"><center><button style="width: 200px; height: 30px; text-align:center; vertical-align: middle;" class="character-button-block light-box-download-image" onclick="window.open($(\'.lb-image\').attr(\'src\'))">Open High Resolution Image</button></center></div>');
};