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

// 모델 로드
let model;
async function loadModel() {
  const modelPath = './web_model/model.json'; // GitHub Pages에서 호스팅된 경로
  model = await tf.loadLayersModel(modelPath);
  console.log('모델 로드 완료');
}

// 이미지 전처리 및 실행
async function runModel(inputImage) {
  if (!model) {
    alert('모델이 아직 로드되지 않았습니다.');
    return;
  }

  // 이미지 전처리 (예: 224x224 크기로 조정)
  const tensor = tf.browser.fromPixels(inputImage)
    .resizeBilinear([224, 224])
    .expandDims(0)
    .toFloat()
    .div(255);

  // 모델 예측
  const prediction = model.predict(tensor);
  const predictionArray = await prediction.array();

  // 결과 표시
  document.getElementById('result').innerHTML = `<span style="color: green;">결과: ${JSON.stringify(predictionArray)}</span>`;
}

// 실행 버튼에 로직 연결
document.getElementById('runButton').addEventListener('click', async () => {
  const userImage = document.getElementById('userImageDrop').querySelector('img');
  const clothImage = document.getElementById('clothImageDrop').querySelector('img');

  if (!userImage || !clothImage) {
    document.getElementById('result').innerHTML = '<span style="color: red;">이미지와 옷 이미지를 모두 업로드하세요!</span>';
    return;
  }

  await runModel(userImage); // 예: 사용자 이미지만 모델에 전달
});

// 모델 로드 호출
loadModel();

