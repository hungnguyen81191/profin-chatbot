const axios = require('axios');

export async function getQuestionFromImagesAndPrompt(promtTxt: string, base64Images: string[], apiKey: string) {
    const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
    };
    const contentList = [
    {
      type: 'text',
      text: 'Phân tích các ảnh dưới đây kết hợp với prompt người dùng để tạo ra một câu hỏi kỹ thuật súc tích dùng cho tìm kiếm tài liệu.'
    }
  ];
  contentList.push({
    type: 'text',
    text: `Prompt người dùng: ${promtTxt}`
  });

  // Yêu cầu gửi tới API
  const body = {
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: contentList
      }
    ],
    temperature: 0.2
  };
  var openaiUrl = process.env.OPENAI_API_URL || '';
  try {
    const response = await axios.post(
      openaiUrl,
      body,
      { headers }
    );

    const reply = response.data?.choices?.[0]?.message?.content;
    return reply || 'Không thể phân tích được ảnh và prompt.';
  } catch (error) {
    throw new Error(`GPT API Error: ${error.response?.status}\n${error.response?.data?.error?.message || error.message}`);
  }
}