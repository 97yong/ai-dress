let userImageUploaded = false;
let clothImageUploaded = false;

function setupUploadArea(dropAreaId, inputId) {
  const dropArea = document.getElementById(dropAreaId);
  const inputFile = document.getElementById(inputId);

  dropArea.addEventListener('click', () => inputFile.click());

  inputFile.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      displayImage(dropArea, file);
      if (dropAreaId === 'userImageDrop') userImageUploaded = true;
      if (dropAreaId === 'clothImageDrop') clothImageUploaded = true;
    }
  });

  dropArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropArea.style.backgroundColor = '#eaf4fc';
  });

  dropArea.addEventListener('dragleave', () => {
    dropArea.style.backgroundColor = '#f5f5f5';
  });

  dropArea.addEventListener('drop', (event) => {
    event.preventDefault();
    dropArea.style.backgroundColor = '#f5f5f5';
    const file = event.dataTransfer.files[0];
    if (file) {
      displayImage(dropArea, file);
      if (dropAreaId === 'userImageDrop') userImageUploaded = true;
      if (dropAreaId === 'clothImageDrop') clothImageUploaded = true;
    }
  });
}

function displayImage(container, file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    container.innerHTML = `<img src="${e.target.result}" alt="Uploaded Image" style="max-width: 100%; max-height: 100%;">`;
  };
  reader.readAsDataURL(file);
}

document.getElementById('runButton').addEventListener('click', () => {
  const resultArea = document.getElementById('result');

  if (!userImageUploaded || !clothImageUploaded) {
    resultArea.innerHTML = '<span style="color: red;">이미지와 옷 이미지를 모두 업로드하세요!</span>';
    return;
  }

  resultArea.innerHTML = '<span style="color: green;">모델 실행 중...</span>';
  setTimeout(() => {
    resultArea.innerHTML = '<span style="color: green;">모델 결과가 표시되었습니다!</span>';
  }, 2000);
});

setupUploadArea('userImageDrop', 'userImageInput');
setupUploadArea('clothImageDrop', 'clothImageInput');
