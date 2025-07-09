import express from 'express'
import multer from 'multer'
import simpleGit from 'simple-git'
import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import dotenv from 'dotenv'
import cors from 'cors'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()
const app = express()

// CORS 설정 추가
app.use(cors())
app.use(express.json({ limit: '50mb' }))

const upload = multer({ dest: 'tokens/' })
const git = simpleGit()

// 프론트엔드에서 호출하는 엔드포인트 개선
app.post('/api/upload-token', async (req, res) => {
  try {
    console.log('토큰 업로드 시작...')
    
    // 1. JSON 파일로 저장
    const destPath = path.resolve('style-dictionary', 'tokens.json')
    fs.writeFileSync(destPath, JSON.stringify(req.body, null, 2), 'utf-8')
    console.log('JSON 파일 저장 완료:', destPath)

    // 2. Style Dictionary 빌드
    exec('npx style-dictionary build --config style-dictionary/config.json', async (error) => {
      if (error) {
        console.error('Style Dictionary 빌드 오류:', error)
        return res.status(500).json({ status: 'build_error', error: error.message })
      }
      
      console.log('CSS 빌드 완료')

      // 3. Git 작업
      try {
        // 현재 브랜치 확인
        const currentBranch = await git.branch()
        console.log('현재 브랜치:', currentBranch.current)
        
        // main 브랜치로 체크아웃
        await git.checkout('main')
        console.log('main 브랜치로 체크아웃 완료')
        
        // 원격에서 최신 변경사항 가져오기
        await git.pull('origin', 'main')
        console.log('원격 변경사항 가져오기 완료')
        
        // 새로운 브랜치 생성
        const branch = `token-update-${Date.now()}`
        await git.checkoutLocalBranch(branch)
        console.log('새 브랜치 생성:', branch)
        
        // 변경사항 스테이징
        await git.add(['style-dictionary/tokens.json'])
        console.log('tokens.json 스테이징 완료')
        
        // 커밋
        await git.commit('feat: update design tokens')
        console.log('커밋 완료')
        
        // 푸시
        await git.push('origin', branch)
        console.log('푸시 완료:', branch)
        
        // 4. GitHub Actions 트리거 (repository_dispatch)
        console.log('GitHub Actions 트리거 시작...')
        const dispatchResponse = await fetch(`https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/dispatches`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28'
          },
          body: JSON.stringify({
            event_type: 'update-design-tokens',
            client_payload: {
              branch: branch,
              timestamp: new Date().toISOString(),
              message: '디자인 토큰 업데이트'
            }
          })
        })
        
        console.log('GitHub Actions 트리거 응답:', dispatchResponse.status)
        
        if (!dispatchResponse.ok) {
          const errorText = await dispatchResponse.text()
          console.error('GitHub Actions 트리거 오류:', dispatchResponse.status, errorText)
          // 트리거 실패해도 Git 작업은 성공했으므로 성공으로 응답
        }
        
        console.log('모든 작업 완료!')
        res.json({ 
          status: 'success', 
          message: '토큰 업로드 및 Git 푸시 완료. GitHub Actions가 PR을 생성합니다.',
          branch: branch
        })
        
      } catch (err) {
        console.error('Git 작업 오류:', err)
        res.status(500).json({ status: 'git_error', message: err.message })
      }
    })
    
  } catch (err) {
    console.error('전체 오류:', err)
    res.status(500).json({ status: 'error', message: err.message })
  }
})

// 상태 확인 엔드포인트
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'running',
    timestamp: new Date().toISOString(),
    environment: {
      GITHUB_OWNER: process.env.GITHUB_OWNER ? '설정됨' : '설정되지 않음',
      GITHUB_REPO: process.env.GITHUB_REPO ? '설정됨' : '설정되지 않음',
      GITHUB_TOKEN: process.env.GITHUB_TOKEN ? '설정됨' : '설정되지 않음'
    }
  })
})

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000')
  console.log('환경변수 확인:')
  console.log('- GITHUB_OWNER:', process.env.GITHUB_OWNER || '설정되지 않음')
  console.log('- GITHUB_REPO:', process.env.GITHUB_REPO || '설정되지 않음')
  console.log('- GITHUB_TOKEN:', process.env.GITHUB_TOKEN ? '설정됨' : '설정되지 않음')
})