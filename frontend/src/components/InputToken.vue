
<template>
  <input type="file" accept="application/json" @change="onFileChange" />
  <button :disabled="!jsonContent" @click="sendJson">전송하기</button>
</template>

<script setup>
import { ref } from 'vue'

const jsonContent = ref(null)

function onFileChange(event) {
  const file = event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      jsonContent.value = JSON.parse(e.target.result)
      // 여기서 jsonContent.value를 활용해 원하는 작업을 할 수 있습니다.
      console.log('업로드된 JSON:', jsonContent.value)
    } catch (err) {
      alert('유효한 JSON 파일이 아닙니다.')
    }
  }
  reader.readAsText(file)
}

async function sendJson() {
  try {
    const response = await fetch('http://localhost:3000/api/upload-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonContent.value),
    })
    
    const result = await response.json()
    
    if (!response.ok) {
      if (result.status === 'busy') {
        alert('처리 중입니다. 잠시 후 다시 시도해주세요.')
        return
      }
      throw new Error(result.message || '서버 오류')
    }
    
    // 성공 응답 처리
    switch (result.status) {
      case 'success':
        alert(`✅ 전송 성공!\n브랜치: ${result.branch}\nGitHub Actions가 PR을 생성합니다.`)
        break
      case 'no_changes':
        alert('ℹ️ 변경사항이 없어 PR을 생성하지 않았습니다.')
        break
      default:
        alert('전송 완료!')
    }
  } catch (err) {
    alert('❌ 전송 실패: ' + err.message)
  }
}
</script>
