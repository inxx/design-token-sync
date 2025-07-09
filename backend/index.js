import express from 'express'
import multer from 'multer'
import simpleGit from 'simple-git'
import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import cors from 'cors'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()
const app = express()

// CORS 설정 추가
app.use(cors())
app.use(express.json())

const upload = multer({ dest: 'tokens/' })
const git = simpleGit()

// 프론트엔드에서 호출하는 엔드포인트 개선
app.post('/api/upload-token', async (req, res) => {
  try {
    // 1. JSON 파일로 저장
    const destPath = path.resolve('style-dictionary', 'tokens.json')
    fs.writeFileSync(destPath, JSON.stringify(req.body, null, 2), 'utf-8')

    // 2. Style Dictionary 빌드
    exec('npx style-dictionary build --config style-dictionary/config.json', async (error) => {
      if (error) return res.status(500).json({ status: 'build_error', error: error.message })

      // 3. Git 브랜치 생성 및 커밋, 푸시만 수행
      try {
        const branch = `token-update-${Date.now()}`
        await git.checkout('main')
        await git.pull()
        await git.checkoutLocalBranch(branch)

        // CSS 파일 복사
        const cssSrc = path.resolve(__dirname, 'build/css/variables.css')
        const cssDest = path.resolve(__dirname, 'styles/variables.css')
        const cssDestDir = path.dirname(cssDest)
        if (!fs.existsSync(cssDestDir)) {
          fs.mkdirSync(cssDestDir, { recursive: true })
        }
        fs.copyFileSync(cssSrc, cssDest)

        await git.add('./styles/variables.css')
        await git.commit('feat: update design tokens')
        await git.push('origin', branch)

        console.log('브랜치 푸시 완료:', branch)
        res.json({ status: 'done', branch: branch })
      } catch (err) {
        console.error(err)
        res.status(500).json({ status: 'error', message: err.message })
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ status: 'error', message: err.message })
  }
})

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000')
})