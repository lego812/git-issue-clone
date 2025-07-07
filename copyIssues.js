import axios from 'axios';

const GITHUB_TOKEN = '깃허브 이슈 복사 코드';
const SOURCE_OWNER = '원본 레포지토리 주인';
const SOURCE_REPO = '원본 레포지토리 명';
const TARGET_OWNER = '내 깃허브 아이디';
const TARGET_REPO = '내 레포지토리 명';

const headers = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: 'application/vnd.github.v3+json'
};

async function copyIssues() {
  try {
    console.log(`🔍 요청 주소: https://api.github.com/repos/${SOURCE_OWNER}/${SOURCE_REPO}/issues`);
    const { data: issues } = await axios.get(
      `https://api.github.com/repos/${SOURCE_OWNER}/${SOURCE_REPO}/issues`,
      { headers }
    );

    for (const issue of issues) {
      // Pull Requests는 제외
      if (issue.pull_request) continue;

      await axios.post(
        `https://api.github.com/repos/${TARGET_OWNER}/${TARGET_REPO}/issues`,
        {
          title: issue.title,
          body: `복사된 이슈: 원본 [#${issue.number}](${issue.html_url})\n\n---\n\n${issue.body || ''}`
        },
        { headers }
      );
      console.log(`✅ 복사 완료: ${issue.title}`);
    }
  } catch (error) {
    console.error('🚨 오류 발생:', error.message);
  }
}

copyIssues();
