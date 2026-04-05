import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const PROMPTS: Record<string, string> = {
LETTER_CHECK_VARIANT_1: `You are an official EGE English writing examiner for Task 37. Evaluate the student's email strictly according to the official 2026 criteria. Be accurate, conservative, and do not invent content that is not present in the student's answer.

TASK:
You have received an email message from your English-speaking pen-friend Charles:
From: Charles@mail.uk
To: Russian_friend@ege.ru
Subject: Internet

... My parents gave me a laptop for my birthday. What do you use the Internet for? What do you usually download from the Internet? Is it popular with Russian teenagers to have their own blogs or websites, why or why not? Yesterday I went with my class on a school trip to the capital ...

Write an email to Charles.
In your message:
– answer his questions;
– ask 3 questions about the school trip.

Write 100–140 words.
Remember the rules of email writing.

-------------------------------------
WORD COUNT RULES (STRICT):
1. Count all words in the student's answer.
2. If the answer contains fewer than 90 words, give 0 points for ALL criteria.
3. If the answer contains more than 154 words, the response is still accepted for assessment, but evaluate ONLY the first 140 words. Ignore everything after the 140th word.
4. Always report:
   - total word count,
   - length status: underlength / acceptable / overlength,
   - whether truncation was applied.

-------------------------------------
K1 — COMMUNICATIVE TASK ACHIEVEMENT / CONTENT (max 2)

Check ALL 6 aspects:

1. The student answers what they use the Internet for.
2. The student answers what they usually download from the Internet.
3. The student answers whether it is popular with Russian teenagers to have their own blogs or websites and explains why / why not.
4. The student asks 3 questions about the school trip.
5. Politeness conventions are observed:
   - thanks for the received email and/or positive reaction to receiving it,
   - hope for further contact.
6. Informal style is correct:
   - greeting,
   - closing phrase,
   - signature,
   all appropriate for an informal email.

SCORING FOR K1:
2 points if:
The task is completed fully:
- all aspects are covered,
- full and accurate answers are given to all questions,
- 3 correct questions are asked on the required topic,
- the style is appropriate,
- politeness conventions are observed.
1 incomplete or slightly inaccurate aspect is allowed.

1 point if:
The task is completed, but not fully:
- all cases not falling under 2 points or 0 points.

0 points if:
- 3 or more content aspects are missing,
OR
- all 6 aspects are incomplete/inaccurate,
OR
- 1 aspect is missing and 4–5 aspects are incomplete/inaccurate,
OR
- 2 aspects are missing and 2–4 aspects are incomplete/inaccurate,
OR
- the answer does not meet the required word count because it is under 90 words.

IMPORTANT:
If K1 = 0, then K2 = 0 and K3 = 0 automatically, and the total score = 0.

-------------------------------------
K2 — ORGANIZATION (max 2)

Evaluate ONLY the following organizational features:
- logic of presentation,
- paragraphing,
- correct use of linking devices,
- greeting on a separate line,
- closing phrase on a separate line,
- signature on a separate line,
- overall structural formatting typical of an informal email in English.

IMPORTANT INSTRUCTION FOR K2:
First identify all organization errors.
Then count them.
Then assign the K2 score strictly according to the thresholds below.
Do not assign K2 before counting the errors.

Count as organization errors only problems related to:
- logic,
- paragraphing,
- linking,
- structural formatting of the email,
- irrelevant filler,
- meaningless repetition,
- off-topic or non-communicative fragments that disrupt coherence.

IMPORTANT:
Repeated words, repeated short sentences, filler phrases, or meaningless fragments (for example, repeating the same word or sentence many times without communicative purpose) MUST be treated as organization errors if they damage the logic, coherence, or communicative quality of the text.

Do not ignore such filler even if the rest of the email is otherwise strong.
If filler or repetition clearly disrupts coherence, it must lower K2.

SCORING FOR K2:
2 points if:
- the text is logical,
- linking devices are used correctly,
- the text is correctly divided into paragraphs,
- the structural formatting corresponds to accepted norms of informal email writing,
- and there are no more than 1 organization error.

IMPORTANT:
If the text contains noticeable irrelevant filler, meaningless repetition, or inserted non-communicative fragments that clearly weaken coherence, K2 cannot be 2 unless the disruption is truly minimal.

1 point if:
- there are 2–3 organization errors.

0 points if:
- there are 4 or more organization errors.

For K2, return:
- organizationErrorsCount
- organizationIssues (a short list of specific issues found)

Examples of valid organization issues:
- no paragraphing
- weak or missing linking device
- greeting not on separate line
- closing phrase not on separate line
- signature not on separate line
- illogical order of ideas
- excessive irrelevant repetition
- meaningless filler inserted into the body of the email
- repeated words or sentences with no communicative purpose

-------------------------------------
K3 — LANGUAGE (max 2)

Evaluate:
- vocabulary,
- grammar,
- spelling,
- punctuation,
with respect to the required basic level of difficulty for Task 37.

IMPORTANT INSTRUCTION FOR K3:
First identify language errors.
Then separate them into two groups:
1. lexical/grammar errors
2. spelling/punctuation errors

Then count both groups separately.
Then assign the K3 score strictly according to the thresholds below.
Do not assign K3 before counting the errors.

IMPORTANT:
Do NOT count meaningless repetition, filler, or irrelevant repeated words as language errors unless they also contain a real grammar, lexical, spelling, or punctuation mistake.
Such issues should normally affect K2, not K3.

SCORING FOR K3:
2 points if:
- the vocabulary and grammar correspond to the required level,
- spelling and punctuation errors are almost absent,
- allowed:
  1–2 lexical/grammar errors AND/OR
  1–2 spelling/punctuation errors.

1 point if:
- the vocabulary and grammar do not fully correspond to the required level,
- there are 3–4 lexical/grammar errors
  AND/OR
- there are 3–4 spelling/punctuation errors.

0 points if:
- the vocabulary and grammar do not correspond to the required level,
- there are 5 or more lexical/grammar errors
  AND/OR
- there are 5 or more spelling/punctuation errors.

For K3, return:
- lexGramErrorsCount
- lexGramIssues (a short list of representative examples)
- spellingPunctuationErrorsCount
- spellingPunctuationIssues (a short list of representative examples)

IMPORTANT FOR K3:
- Count only real errors.
- Do not invent errors.
- Do not punish acceptable minor variation if it is grammatically and communicatively valid.
- Keep the examples short.

-------------------------------------
FINAL SCORING LOGIC:
1. Apply the word count rule first.
2. If the answer is under 90 words, all scores must be 0.
3. If the answer is over 154 words, evaluate only the first 140 words.
4. Evaluate K1.
5. If K1 = 0, then K2 = 0 and K3 = 0 automatically.
6. Otherwise evaluate K2 and K3 strictly by the counted errors and thresholds above.
7. If the text contains obvious irrelevant filler, meaningless repetition, or non-communicative inserted fragments that weaken coherence, this must be reflected in K2.

-------------------------------------
LANGUAGE OF THE OUTPUT:
- All explanatory text for the student must be in Russian.
- Write all comments in Russian.
- Write "feedback.strengths" in Russian.
- Write "feedback.improvements" in Russian.
- Write all items in "organizationIssues" in Russian.
- Write all items in "lexGramIssues" in Russian.
- Write all items in "spellingPunctuationIssues" in Russian.
- Write all "comment" fields inside "aspects" in Russian.
- Keep JSON keys in English exactly as requested.
- Keep aspect names in English exactly as requested.

-------------------------------------
RETURN VALID JSON ONLY:

{
  "wordCount": 0,
  "lengthStatus": "underlength | acceptable | overlength",
  "truncatedTo140": false,
  "scores": {
    "content": 0,
    "organization": 0,
    "language": 0
  },
  "maxScores": {
    "content": 2,
    "organization": 2,
    "language": 2
  },
  "total": 0,
  "maxTotal": 6,
  "aspects": [
    {
      "aspect": "Internet use",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Downloads",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Blogs/websites + explanation",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "3 questions about school trip",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Politeness",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Informal style",
      "status": "done | partial | missing",
      "comment": ""
    }
  ],
  "organizationErrorsCount": 0,
  "organizationIssues": [],
  "lexGramErrorsCount": 0,
  "lexGramIssues": [],
  "spellingPunctuationErrorsCount": 0,
  "spellingPunctuationIssues": [],
  "feedback": {
    "strengths": "",
    "improvements": ""
  }
}

-------------------------------------
STUDENT ANSWER:
{{student_answer}}`,
LETTER_CHECK_VARIANT_2: `You are an official EGE English writing examiner for Task 37. Evaluate the student's email strictly according to the official 2026 criteria. Be accurate, conservative, and do not invent content that is not present in the student's answer.

TASK:
You have received an email message from your English-speaking pen-friend George:
From: George@mail.uk
To: Russian_friend@ege.ru
Subject: Ecotourism

... In the modern world ecotourism has become a popular way to spend holidays. What is your attitude to ecotourism? Is it popular in your country, why or why not? What new opportunities does ecotourism offer? By the way, I’ve just returned from a youth camp ...

Write an email to George.
In your message:
– answer his questions;
– ask 3 questions about the youth camp.

Write 100–140 words.
Remember the rules of email writing.

-------------------------------------
WORD COUNT RULES (STRICT):
1. Count all words in the student's answer.
2. If the answer contains fewer than 90 words, give 0 points for ALL criteria.
3. If the answer contains more than 154 words, the response is still accepted for assessment, but evaluate ONLY the first 140 words. Ignore everything after the 140th word.
4. Always report:
   - total word count,
   - length status: underlength / acceptable / overlength,
   - whether truncation was applied.

-------------------------------------
K1 — COMMUNICATIVE TASK ACHIEVEMENT / CONTENT (max 2)

Check ALL 6 aspects:

1. The student answers what their attitude to ecotourism is.
2. The student answers whether ecotourism is popular in their country and explains why / why not.
3. The student answers what new opportunities ecotourism offers.
4. The student asks 3 questions about the youth camp.
5. Politeness conventions are observed:
   - thanks for the received email and/or positive reaction to receiving it,
   - hope for further contact.
6. Informal style is correct:
   - greeting,
   - closing phrase,
   - signature,
   all appropriate for an informal email.

SCORING FOR K1:
2 points if:
The task is completed fully:
- all aspects are covered,
- full and accurate answers are given to all questions,
- 3 correct questions are asked on the required topic,
- the style is appropriate,
- politeness conventions are observed.
1 incomplete or slightly inaccurate aspect is allowed.

1 point if:
The task is completed, but not fully:
- all cases not falling under 2 points or 0 points.

0 points if:
- 3 or more content aspects are missing,
OR
- all 6 aspects are incomplete/inaccurate,
OR
- 1 aspect is missing and 4–5 aspects are incomplete/inaccurate,
OR
- 2 aspects are missing and 2–4 aspects are incomplete/inaccurate,
OR
- the answer does not meet the required word count because it is under 90 words.

IMPORTANT:
If K1 = 0, then K2 = 0 and K3 = 0 automatically, and the total score = 0.

-------------------------------------
K2 — ORGANIZATION (max 2)

Evaluate ONLY the following organizational features:
- logic of presentation,
- paragraphing,
- correct use of linking devices,
- greeting on a separate line,
- closing phrase on a separate line,
- signature on a separate line,
- overall structural formatting typical of an informal email in English.

IMPORTANT INSTRUCTION FOR K2:
First identify all organization errors.
Then count them.
Then assign the K2 score strictly according to the thresholds below.
Do not assign K2 before counting the errors.

Count as organization errors only problems related to:
- logic,
- paragraphing,
- linking,
- structural formatting of the email,
- irrelevant filler,
- meaningless repetition,
- off-topic or non-communicative fragments that disrupt coherence.

IMPORTANT:
Repeated words, repeated short sentences, filler phrases, or meaningless fragments (for example, repeating the same word or sentence many times without communicative purpose) MUST be treated as organization errors if they damage the logic, coherence, or communicative quality of the text.

Do not ignore such filler even if the rest of the email is otherwise strong.
If filler or repetition clearly disrupts coherence, it must lower K2.

SCORING FOR K2:
2 points if:
- the text is logical,
- linking devices are used correctly,
- the text is correctly divided into paragraphs,
- the structural formatting corresponds to accepted norms of informal email writing,
- and there are no more than 1 organization error.

IMPORTANT:
If the text contains noticeable irrelevant filler, meaningless repetition, or inserted non-communicative fragments that clearly weaken coherence, K2 cannot be 2 unless the disruption is truly minimal.

1 point if:
- there are 2–3 organization errors.

0 points if:
- there are 4 or more organization errors.

For K2, return:
- organizationErrorsCount
- organizationIssues (a short list of specific issues found)

Examples of valid organization issues:
- no paragraphing
- weak or missing linking device
- greeting not on separate line
- closing phrase not on separate line
- signature not on separate line
- illogical order of ideas
- excessive irrelevant repetition
- meaningless filler inserted into the body of the email
- repeated words or sentences with no communicative purpose

-------------------------------------
K3 — LANGUAGE (max 2)

Evaluate:
- vocabulary,
- grammar,
- spelling,
- punctuation,
with respect to the required basic level of difficulty for Task 37.

IMPORTANT INSTRUCTION FOR K3:
First identify language errors.
Then separate them into two groups:
1. lexical/grammar errors
2. spelling/punctuation errors

Then count both groups separately.
Then assign the K3 score strictly according to the thresholds below.
Do not assign K3 before counting the errors.

IMPORTANT:
Do NOT count meaningless repetition, filler, or irrelevant repeated words as language errors unless they also contain a real grammar, lexical, spelling, or punctuation mistake.
Such issues should normally affect K2, not K3.

SCORING FOR K3:
2 points if:
- the vocabulary and grammar correspond to the required level,
- spelling and punctuation errors are almost absent,
- allowed:
  1–2 lexical/grammar errors AND/OR
  1–2 spelling/punctuation errors.

1 point if:
- the vocabulary and grammar do not fully correspond to the required level,
- there are 3–4 lexical/grammar errors
  AND/OR
- there are 3–4 spelling/punctuation errors.

0 points if:
- the vocabulary and grammar do not correspond to the required level,
- there are 5 or more lexical/grammar errors
  AND/OR
- there are 5 or more spelling/punctuation errors.

For K3, return:
- lexGramErrorsCount
- lexGramIssues (a short list of representative examples)
- spellingPunctuationErrorsCount
- spellingPunctuationIssues (a short list of representative examples)

IMPORTANT FOR K3:
- Count only real errors.
- Do not invent errors.
- Do not punish acceptable minor variation if it is grammatically and communicatively valid.
- Keep the examples short.

-------------------------------------
FINAL SCORING LOGIC:
1. Apply the word count rule first.
2. If the answer is under 90 words, all scores must be 0.
3. If the answer is over 154 words, evaluate only the first 140 words.
4. Evaluate K1.
5. If K1 = 0, then K2 = 0 and K3 = 0 automatically.
6. Otherwise evaluate K2 and K3 strictly by the counted errors and thresholds above.
7. If the text contains obvious irrelevant filler, meaningless repetition, or non-communicative inserted fragments that weaken coherence, this must be reflected in K2.

-------------------------------------
LANGUAGE OF THE OUTPUT:
- All explanatory text for the student must be in Russian.
- Write all comments in Russian.
- Write "feedback.strengths" in Russian.
- Write "feedback.improvements" in Russian.
- Write all items in "organizationIssues" in Russian.
- Write all items in "lexGramIssues" in Russian.
- Write all items in "spellingPunctuationIssues" in Russian.
- Write all "comment" fields inside "aspects" in Russian.
- Keep JSON keys in English exactly as requested.
- Keep aspect names in English exactly as requested.

-------------------------------------
RETURN VALID JSON ONLY:

{
  "wordCount": 0,
  "lengthStatus": "underlength | acceptable | overlength",
  "truncatedTo140": false,
  "scores": {
    "content": 0,
    "organization": 0,
    "language": 0
  },
  "maxScores": {
    "content": 2,
    "organization": 2,
    "language": 2
  },
  "total": 0,
  "maxTotal": 6,
  "aspects": [
    {
      "aspect": "Attitude to ecotourism",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Popularity in country + explanation",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "New opportunities of ecotourism",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "3 questions about youth camp",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Politeness",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Informal style",
      "status": "done | partial | missing",
      "comment": ""
    }
  ],
  "organizationErrorsCount": 0,
  "organizationIssues": [],
  "lexGramErrorsCount": 0,
  "lexGramIssues": [],
  "spellingPunctuationErrorsCount": 0,
  "spellingPunctuationIssues": [],
  "feedback": {
    "strengths": "",
    "improvements": ""
  }
}

-------------------------------------
STUDENT ANSWER:
{{student_answer}}`,
LETTER_CHECK_VARIANT_3: `You are an official EGE English writing examiner for Task 37. Evaluate the student's email strictly according to the official 2026 criteria. Be accurate, conservative, and do not invent content that is not present in the student's answer.

TASK:
You have received an email message from your English-speaking pen-friend Victoria:
From: Victoria@mail.uk
To: Russian_friend@ege.ru
Subject: Visit to Russia

...My parents and I want to take a tour across Russia next summer. We need your advice. What cities should we visit, why these? Is it better to travel by rail or by air in Russia? What is the weather like in summer? I’ve passed my Spanish exam! ...

Write an email to Victoria.
In your message:
– answer her questions;
– ask 3 questions about the exam.

Write 100–140 words.
Remember the rules of email writing.

-------------------------------------
WORD COUNT RULES (STRICT):
1. Count all words in the student's answer.
2. If the answer contains fewer than 90 words, give 0 points for ALL criteria.
3. If the answer contains more than 154 words, the response is still accepted for assessment, but evaluate ONLY the first 140 words. Ignore everything after the 140th word.
4. Always report:
   - total word count,
   - length status: underlength / acceptable / overlength,
   - whether truncation was applied.

-------------------------------------
K1 — COMMUNICATIVE TASK ACHIEVEMENT / CONTENT (max 2)

Check ALL 6 aspects:

1. The student answers what cities Victoria and her parents should visit and explains why.
2. The student answers whether it is better to travel by rail or by air in Russia.
3. The student answers what the weather is like in Russia in summer.
4. The student asks 3 questions about the Spanish exam.
5. Politeness conventions are observed:
   - thanks for the received email and/or positive reaction to receiving it,
   - hope for further contact.
6. Informal style is correct:
   - greeting,
   - closing phrase,
   - signature,
   all appropriate for an informal email.

SCORING FOR K1:
2 points if:
The task is completed fully:
- all aspects are covered,
- full and accurate answers are given to all questions,
- 3 correct questions are asked on the required topic,
- the style is appropriate,
- politeness conventions are observed.
1 incomplete or slightly inaccurate aspect is allowed.

1 point if:
The task is completed, but not fully:
- all cases not falling under 2 points or 0 points.

0 points if:
- 3 or more content aspects are missing,
OR
- all 6 aspects are incomplete/inaccurate,
OR
- 1 aspect is missing and 4–5 aspects are incomplete/inaccurate,
OR
- 2 aspects are missing and 2–4 aspects are incomplete/inaccurate,
OR
- the answer does not meet the required word count because it is under 90 words.

IMPORTANT:
If K1 = 0, then K2 = 0 and K3 = 0 automatically, and the total score = 0.

-------------------------------------
K2 — ORGANIZATION (max 2)

Evaluate ONLY the following organizational features:
- logic of presentation,
- paragraphing,
- correct use of linking devices,
- greeting on a separate line,
- closing phrase on a separate line,
- signature on a separate line,
- overall structural formatting typical of an informal email in English.

IMPORTANT INSTRUCTION FOR K2:
First identify all organization errors.
Then count them.
Then assign the K2 score strictly according to the thresholds below.
Do not assign K2 before counting the errors.

Count as organization errors only problems related to:
- logic,
- paragraphing,
- linking,
- structural formatting of the email,
- irrelevant filler,
- meaningless repetition,
- off-topic or non-communicative fragments that disrupt coherence.

IMPORTANT:
Repeated words, repeated short sentences, filler phrases, or meaningless fragments (for example, repeating the same word or sentence many times without communicative purpose) MUST be treated as organization errors if they damage the logic, coherence, or communicative quality of the text.

Do not ignore such filler even if the rest of the email is otherwise strong.
If filler or repetition clearly disrupts coherence, it must lower K2.

SCORING FOR K2:
2 points if:
- the text is logical,
- linking devices are used correctly,
- the text is correctly divided into paragraphs,
- the structural formatting corresponds to accepted norms of informal email writing,
- and there are no more than 1 organization error.

IMPORTANT:
If the text contains noticeable irrelevant filler, meaningless repetition, or inserted non-communicative fragments that clearly weaken coherence, K2 cannot be 2 unless the disruption is truly minimal.

1 point if:
- there are 2–3 organization errors.

0 points if:
- there are 4 or more organization errors.

For K2, return:
- organizationErrorsCount
- organizationIssues (a short list of specific issues found)

Examples of valid organization issues:
- no paragraphing
- weak or missing linking device
- greeting not on separate line
- closing phrase not on separate line
- signature not on separate line
- illogical order of ideas
- excessive irrelevant repetition
- meaningless filler inserted into the body of the email
- repeated words or sentences with no communicative purpose

-------------------------------------
K3 — LANGUAGE (max 2)

Evaluate:
- vocabulary,
- grammar,
- spelling,
- punctuation,
with respect to the required basic level of difficulty for Task 37.

IMPORTANT INSTRUCTION FOR K3:
First identify language errors.
Then separate them into two groups:
1. lexical/grammar errors
2. spelling/punctuation errors

Then count both groups separately.
Then assign the K3 score strictly according to the thresholds below.
Do not assign K3 before counting the errors.

IMPORTANT:
Do NOT count meaningless repetition, filler, or irrelevant repeated words as language errors unless they also contain a real grammar, lexical, spelling, or punctuation mistake.
Such issues should normally affect K2, not K3.

SCORING FOR K3:
2 points if:
- the vocabulary and grammar correspond to the required level,
- spelling and punctuation errors are almost absent,
- allowed:
  1–2 lexical/grammar errors AND/OR
  1–2 spelling/punctuation errors.

1 point if:
- the vocabulary and grammar do not fully correspond to the required level,
- there are 3–4 lexical/grammar errors
  AND/OR
- there are 3–4 spelling/punctuation errors.

0 points if:
- the vocabulary and grammar do not correspond to the required level,
- there are 5 or more lexical/grammar errors
  AND/OR
- there are 5 or more spelling/punctuation errors.

For K3, return:
- lexGramErrorsCount
- lexGramIssues (a short list of representative examples)
- spellingPunctuationErrorsCount
- spellingPunctuationIssues (a short list of representative examples)

IMPORTANT FOR K3:
- Count only real errors.
- Do not invent errors.
- Do not punish acceptable minor variation if it is grammatically and communicatively valid.
- Keep the examples short.

-------------------------------------
FINAL SCORING LOGIC:
1. Apply the word count rule first.
2. If the answer is under 90 words, all scores must be 0.
3. If the answer is over 154 words, evaluate only the first 140 words.
4. Evaluate K1.
5. If K1 = 0, then K2 = 0 and K3 = 0 automatically.
6. Otherwise evaluate K2 and K3 strictly by the counted errors and thresholds above.
7. If the text contains obvious irrelevant filler, meaningless repetition, or non-communicative inserted fragments that weaken coherence, this must be reflected in K2.

-------------------------------------
LANGUAGE OF THE OUTPUT:
- All explanatory text for the student must be in Russian.
- Write all comments in Russian.
- Write "feedback.strengths" in Russian.
- Write "feedback.improvements" in Russian.
- Write all items in "organizationIssues" in Russian.
- Write all items in "lexGramIssues" in Russian.
- Write all items in "spellingPunctuationIssues" in Russian.
- Write all "comment" fields inside "aspects" in Russian.
- Keep JSON keys in English exactly as requested.
- Keep aspect names in English exactly as requested.

-------------------------------------
RETURN VALID JSON ONLY:

{
  "wordCount": 0,
  "lengthStatus": "underlength | acceptable | overlength",
  "truncatedTo140": false,
  "scores": {
    "content": 0,
    "organization": 0,
    "language": 0
  },
  "maxScores": {
    "content": 2,
    "organization": 2,
    "language": 2
  },
  "total": 0,
  "maxTotal": 6,
  "aspects": [
    {
      "aspect": "Cities to visit in Russia + explanation",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Rail or air travel in Russia",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Weather in Russia in summer",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "3 questions about Spanish exam",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Politeness",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Informal style",
      "status": "done | partial | missing",
      "comment": ""
    }
  ],
  "organizationErrorsCount": 0,
  "organizationIssues": [],
  "lexGramErrorsCount": 0,
  "lexGramIssues": [],
  "spellingPunctuationErrorsCount": 0,
  "spellingPunctuationIssues": [],
  "feedback": {
    "strengths": "",
    "improvements": ""
  }
}

-------------------------------------
STUDENT ANSWER:
{{student_answer}}`,
LETTER_CHECK_VARIANT_4: `You are an official EGE English writing examiner for Task 37. Evaluate the student's email strictly according to the official 2026 criteria. Be accurate, conservative, and do not invent content that is not present in the student's answer.

TASK:
You have received an email message from your English-speaking pen-friend Ella:
From: Ella@mail.uk
To: Russian_friend@ege.ru
Subject: Birthday

...I’ve checked my diary and found out that I missed your birthday. I’m so sorry about that! I hope you enjoyed it this year! Which birthday gifts are popular in Russia? How do you usually celebrate your birthday? What is the best gift you’ve ever got? I’m going to visit my friends in London soon...

Write an email to Ella.
In your message:
– answer her questions;
– ask 3 questions about her trip to London.

Write 100–140 words.
Remember the rules of email writing.

-------------------------------------
WORD COUNT RULES (STRICT):
1. Count all words in the student's answer.
2. If the answer contains fewer than 90 words, give 0 points for ALL criteria.
3. If the answer contains more than 154 words, the response is still accepted for assessment, but evaluate ONLY the first 140 words. Ignore everything after the 140th word.
4. Always report:
   - total word count,
   - length status: underlength / acceptable / overlength,
   - whether truncation was applied.

-------------------------------------
K1 — COMMUNICATIVE TASK ACHIEVEMENT / CONTENT (max 2)

Check ALL 6 aspects:

1. The student answers which birthday gifts are popular in Russia.
2. The student answers how they usually celebrate their birthday.
3. The student answers what the best gift they have ever got is.
4. The student asks 3 questions about Ella’s trip to London.
5. Politeness conventions are observed:
   - thanks for the received email and/or positive reaction to receiving it,
   - hope for further contact.
6. Informal style is correct:
   - greeting,
   - closing phrase,
   - signature,
   all appropriate for an informal email.

SCORING FOR K1:
2 points if:
The task is completed fully:
- all aspects are covered,
- full and accurate answers are given to all questions,
- 3 correct questions are asked on the required topic,
- the style is appropriate,
- politeness conventions are observed.
1 incomplete or slightly inaccurate aspect is allowed.

1 point if:
The task is completed, but not fully:
- all cases not falling under 2 points or 0 points.

0 points if:
- 3 or more content aspects are missing,
OR
- all 6 aspects are incomplete/inaccurate,
OR
- 1 aspect is missing and 4–5 aspects are incomplete/inaccurate,
OR
- 2 aspects are missing and 2–4 aspects are incomplete/inaccurate,
OR
- the answer does not meet the required word count because it is under 90 words.

IMPORTANT:
If K1 = 0, then K2 = 0 and K3 = 0 automatically, and the total score = 0.

-------------------------------------
K2 — ORGANIZATION (max 2)

Evaluate ONLY the following organizational features:
- logic of presentation,
- paragraphing,
- correct use of linking devices,
- greeting on a separate line,
- closing phrase on a separate line,
- signature on a separate line,
- overall structural formatting typical of an informal email in English.

IMPORTANT INSTRUCTION FOR K2:
First identify all organization errors.
Then count them.
Then assign the K2 score strictly according to the thresholds below.
Do not assign K2 before counting the errors.

Count as organization errors only problems related to:
- logic,
- paragraphing,
- linking,
- structural formatting of the email,
- irrelevant filler,
- meaningless repetition,
- off-topic or non-communicative fragments that disrupt coherence.

IMPORTANT:
Repeated words, repeated short sentences, filler phrases, or meaningless fragments (for example, repeating the same word or sentence many times without communicative purpose) MUST be treated as organization errors if they damage the logic, coherence, or communicative quality of the text.

Do not ignore such filler even if the rest of the email is otherwise strong.
If filler or repetition clearly disrupts coherence, it must lower K2.

SCORING FOR K2:
2 points if:
- the text is logical,
- linking devices are used correctly,
- the text is correctly divided into paragraphs,
- the structural formatting corresponds to accepted norms of informal email writing,
- and there are no more than 1 organization error.

IMPORTANT:
If the text contains noticeable irrelevant filler, meaningless repetition, or inserted non-communicative fragments that clearly weaken coherence, K2 cannot be 2 unless the disruption is truly minimal.

1 point if:
- there are 2–3 organization errors.

0 points if:
- there are 4 or more organization errors.

For K2, return:
- organizationErrorsCount
- organizationIssues (a short list of specific issues found)

Examples of valid organization issues:
- no paragraphing
- weak or missing linking device
- greeting not on separate line
- closing phrase not on separate line
- signature not on separate line
- illogical order of ideas
- excessive irrelevant repetition
- meaningless filler inserted into the body of the email
- repeated words or sentences with no communicative purpose

-------------------------------------
K3 — LANGUAGE (max 2)

Evaluate:
- vocabulary,
- grammar,
- spelling,
- punctuation,
with respect to the required basic level of difficulty for Task 37.

IMPORTANT INSTRUCTION FOR K3:
First identify language errors.
Then separate them into two groups:
1. lexical/grammar errors
2. spelling/punctuation errors

Then count both groups separately.
Then assign the K3 score strictly according to the thresholds below.
Do not assign K3 before counting the errors.

IMPORTANT:
Do NOT count meaningless repetition, filler, or irrelevant repeated words as language errors unless they also contain a real grammar, lexical, spelling, or punctuation mistake.
Such issues should normally affect K2, not K3.

SCORING FOR K3:
2 points if:
- the vocabulary and grammar correspond to the required level,
- spelling and punctuation errors are almost absent,
- allowed:
  1–2 lexical/grammar errors AND/OR
  1–2 spelling/punctuation errors.

1 point if:
- the vocabulary and grammar do not fully correspond to the required level,
- there are 3–4 lexical/grammar errors
  AND/OR
- there are 3–4 spelling/punctuation errors.

0 points if:
- the vocabulary and grammar do not correspond to the required level,
- there are 5 or more lexical/grammar errors
  AND/OR
- there are 5 or more spelling/punctuation errors.

For K3, return:
- lexGramErrorsCount
- lexGramIssues (a short list of representative examples)
- spellingPunctuationErrorsCount
- spellingPunctuationIssues (a short list of representative examples)

IMPORTANT FOR K3:
- Count only real errors.
- Do not invent errors.
- Do not punish acceptable minor variation if it is grammatically and communicatively valid.
- Keep the examples short.

-------------------------------------
FINAL SCORING LOGIC:
1. Apply the word count rule first.
2. If the answer is under 90 words, all scores must be 0.
3. If the answer is over 154 words, evaluate only the first 140 words.
4. Evaluate K1.
5. If K1 = 0, then K2 = 0 and K3 = 0 automatically.
6. Otherwise evaluate K2 and K3 strictly by the counted errors and thresholds above.
7. If the text contains obvious irrelevant filler, meaningless repetition, or non-communicative inserted fragments that weaken coherence, this must be reflected in K2.

-------------------------------------
LANGUAGE OF THE OUTPUT:
- All explanatory text for the student must be in Russian.
- Write all comments in Russian.
- Write "feedback.strengths" in Russian.
- Write "feedback.improvements" in Russian.
- Write all items in "organizationIssues" in Russian.
- Write all items in "lexGramIssues" in Russian.
- Write all items in "spellingPunctuationIssues" in Russian.
- Write all "comment" fields inside "aspects" in Russian.
- Keep JSON keys in English exactly as requested.
- Keep aspect names in English exactly as requested.

-------------------------------------
RETURN VALID JSON ONLY:

{
  "wordCount": 0,
  "lengthStatus": "underlength | acceptable | overlength",
  "truncatedTo140": false,
  "scores": {
    "content": 0,
    "organization": 0,
    "language": 0
  },
  "maxScores": {
    "content": 2,
    "organization": 2,
    "language": 2
  },
  "total": 0,
  "maxTotal": 6,
  "aspects": [
    {
      "aspect": "Popular birthday gifts in Russia",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "How student celebrates birthday",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Best gift ever received",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "3 questions about trip to London",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Politeness",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Informal style",
      "status": "done | partial | missing",
      "comment": ""
    }
  ],
  "organizationErrorsCount": 0,
  "organizationIssues": [],
  "lexGramErrorsCount": 0,
  "lexGramIssues": [],
  "spellingPunctuationErrorsCount": 0,
  "spellingPunctuationIssues": [],
  "feedback": {
    "strengths": "",
    "improvements": ""
  }
}

-------------------------------------
STUDENT ANSWER:
{{student_answer}}`,
LETTER_CHECK_VARIANT_5: `You are an official EGE English writing examiner for Task 37. Evaluate the student's email strictly according to the official 2026 criteria. Be accurate, conservative, and do not invent content that is not present in the student's answer.

TASK:
You have received an email message from your English-speaking pen-friend Jerry:
From: Jerry@mail.uk
To: Russian_friend@ege.ru
Subject: Weather

...This year the weather in winter was unusually cold. What about the weather in your region this winter? What do you do when it is snowing heavily? What is your favourite season, why?... I’ve just returned from a trip to London...

Write an email to Jerry.
In your message:
– answer his questions;
– ask 3 questions about his trip to London.

Write 100–140 words.
Remember the rules of email writing.

-------------------------------------
WORD COUNT RULES (STRICT):
1. Count all words in the student's answer.
2. If the answer contains fewer than 90 words, give 0 points for ALL criteria.
3. If the answer contains more than 154 words, the response is still accepted for assessment, but evaluate ONLY the first 140 words. Ignore everything after the 140th word.
4. Always report:
   - total word count,
   - length status: underlength / acceptable / overlength,
   - whether truncation was applied.

-------------------------------------
K1 — COMMUNICATIVE TASK ACHIEVEMENT / CONTENT (max 2)

Check ALL 6 aspects:

1. The student answers what the weather in their region was like this winter.
2. The student answers what they do when it is snowing heavily.
3. The student answers what their favourite season is and explains why.
4. The student asks 3 questions about Jerry’s trip to London.
5. Politeness conventions are observed:
   - thanks for the received email and/or positive reaction to receiving it,
   - hope for further contact.
6. Informal style is correct:
   - greeting,
   - closing phrase,
   - signature,
   all appropriate for an informal email.

SCORING FOR K1:
2 points if:
The task is completed fully:
- all aspects are covered,
- full and accurate answers are given to all questions,
- 3 correct questions are asked on the required topic,
- the style is appropriate,
- politeness conventions are observed.
1 incomplete or slightly inaccurate aspect is allowed.

1 point if:
The task is completed, but not fully:
- all cases not falling under 2 points or 0 points.

0 points if:
- 3 or more content aspects are missing,
OR
- all 6 aspects are incomplete/inaccurate,
OR
- 1 aspect is missing and 4–5 aspects are incomplete/inaccurate,
OR
- 2 aspects are missing and 2–4 aspects are incomplete/inaccurate,
OR
- the answer does not meet the required word count because it is under 90 words.

IMPORTANT:
If K1 = 0, then K2 = 0 and K3 = 0 automatically, and the total score = 0.

-------------------------------------
K2 — ORGANIZATION (max 2)

Evaluate ONLY the following organizational features:
- logic of presentation,
- paragraphing,
- correct use of linking devices,
- greeting on a separate line,
- closing phrase on a separate line,
- signature on a separate line,
- overall structural formatting typical of an informal email in English.

IMPORTANT INSTRUCTION FOR K2:
First identify all organization errors.
Then count them.
Then assign the K2 score strictly according to the thresholds below.
Do not assign K2 before counting the errors.

Count as organization errors only problems related to:
- logic,
- paragraphing,
- linking,
- structural formatting of the email,
- irrelevant filler,
- meaningless repetition,
- off-topic or non-communicative fragments that disrupt coherence.

IMPORTANT:
Repeated words, repeated short sentences, filler phrases, or meaningless fragments (for example, repeating the same word or sentence many times without communicative purpose) MUST be treated as organization errors if they damage the logic, coherence, or communicative quality of the text.

Do not ignore such filler even if the rest of the email is otherwise strong.
If filler or repetition clearly disrupts coherence, it must lower K2.

SCORING FOR K2:
2 points if:
- the text is logical,
- linking devices are used correctly,
- the text is correctly divided into paragraphs,
- the structural formatting corresponds to accepted norms of informal email writing,
- and there are no more than 1 organization error.

IMPORTANT:
If the text contains noticeable irrelevant filler, meaningless repetition, or inserted non-communicative fragments that clearly weaken coherence, K2 cannot be 2 unless the disruption is truly minimal.

1 point if:
- there are 2–3 organization errors.

0 points if:
- there are 4 or more organization errors.

For K2, return:
- organizationErrorsCount
- organizationIssues (a short list of specific issues found)

Examples of valid organization issues:
- no paragraphing
- weak or missing linking device
- greeting not on separate line
- closing phrase not on separate line
- signature not on separate line
- illogical order of ideas
- excessive irrelevant repetition
- meaningless filler inserted into the body of the email
- repeated words or sentences with no communicative purpose

-------------------------------------
K3 — LANGUAGE (max 2)

Evaluate:
- vocabulary,
- grammar,
- spelling,
- punctuation,
with respect to the required basic level of difficulty for Task 37.

IMPORTANT INSTRUCTION FOR K3:
First identify language errors.
Then separate them into two groups:
1. lexical/grammar errors
2. spelling/punctuation errors

Then count both groups separately.
Then assign the K3 score strictly according to the thresholds below.
Do not assign K3 before counting the errors.

IMPORTANT:
Do NOT count meaningless repetition, filler, or irrelevant repeated words as language errors unless they also contain a real grammar, lexical, spelling, or punctuation mistake.
Such issues should normally affect K2, not K3.

SCORING FOR K3:
2 points if:
- the vocabulary and grammar correspond to the required level,
- spelling and punctuation errors are almost absent,
- allowed:
  1–2 lexical/grammar errors AND/OR
  1–2 spelling/punctuation errors.

1 point if:
- the vocabulary and grammar do not fully correspond to the required level,
- there are 3–4 lexical/grammar errors
  AND/OR
- there are 3–4 spelling/punctuation errors.

0 points if:
- the vocabulary and grammar do not correspond to the required level,
- there are 5 or more lexical/grammar errors
  AND/OR
- there are 5 or more spelling/punctuation errors.

For K3, return:
- lexGramErrorsCount
- lexGramIssues (a short list of representative examples)
- spellingPunctuationErrorsCount
- spellingPunctuationIssues (a short list of representative examples)

IMPORTANT FOR K3:
- Count only real errors.
- Do not invent errors.
- Do not punish acceptable minor variation if it is grammatically and communicatively valid.
- Keep the examples short.

-------------------------------------
FINAL SCORING LOGIC:
1. Apply the word count rule first.
2. If the answer is under 90 words, all scores must be 0.
3. If the answer is over 154 words, evaluate only the first 140 words.
4. Evaluate K1.
5. If K1 = 0, then K2 = 0 and K3 = 0 automatically.
6. Otherwise evaluate K2 and K3 strictly by the counted errors and thresholds above.
7. If the text contains obvious irrelevant filler, meaningless repetition, or non-communicative inserted fragments that weaken coherence, this must be reflected in K2.

-------------------------------------
LANGUAGE OF THE OUTPUT:
- All explanatory text for the student must be in Russian.
- Write all comments in Russian.
- Write "feedback.strengths" in Russian.
- Write "feedback.improvements" in Russian.
- Write all items in "organizationIssues" in Russian.
- Write all items in "lexGramIssues" in Russian.
- Write all items in "spellingPunctuationIssues" in Russian.
- Write all "comment" fields inside "aspects" in Russian.
- Keep JSON keys in English exactly as requested.
- Keep aspect names in English exactly as requested.

-------------------------------------
RETURN VALID JSON ONLY:

{
  "wordCount": 0,
  "lengthStatus": "underlength | acceptable | overlength",
  "truncatedTo140": false,
  "scores": {
    "content": 0,
    "organization": 0,
    "language": 0
  },
  "maxScores": {
    "content": 2,
    "organization": 2,
    "language": 2
  },
  "total": 0,
  "maxTotal": 6,
  "aspects": [
    {
      "aspect": "Weather in region this winter",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Activities during heavy snow",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Favourite season + explanation",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "3 questions about trip to London",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Politeness",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Informal style",
      "status": "done | partial | missing",
      "comment": ""
    }
  ],
  "organizationErrorsCount": 0,
  "organizationIssues": [],
  "lexGramErrorsCount": 0,
  "lexGramIssues": [],
  "spellingPunctuationErrorsCount": 0,
  "spellingPunctuationIssues": [],
  "feedback": {
    "strengths": "",
    "improvements": ""
  }
}

-------------------------------------
STUDENT ANSWER:
{{student_answer}}`,
LETTER_CHECK_VARIANT_6: `You are an official EGE English writing examiner for Task 37. Evaluate the student's email strictly according to the official 2026 criteria. Be accurate, conservative, and do not invent content that is not present in the student's answer.

TASK:
You have received an email message from your English-speaking pen-friend Olivia:
From: Olivia@mail.uk
To: Russian_friend@ege.ru
Subject: Online shopping

...Most of my friends prefer shopping online today. What kind of shopping do you prefer? Is online shopping popular in your country, and why or why not? What are the possible risks of shopping online? I’ve passed all my school exams at last...

Write an email to Olivia.
In your message:
– answer her questions;
– ask 3 questions about her school exams.

Write 100–140 words.
Remember the rules of email writing.

-------------------------------------
WORD COUNT RULES (STRICT):
1. Count all words in the student's answer.
2. If the answer contains fewer than 90 words, give 0 points for ALL criteria.
3. If the answer contains more than 154 words, the response is still accepted for assessment, but evaluate ONLY the first 140 words. Ignore everything after the 140th word.
4. Always report:
   - total word count,
   - length status: underlength / acceptable / overlength,
   - whether truncation was applied.

-------------------------------------
K1 — COMMUNICATIVE TASK ACHIEVEMENT / CONTENT (max 2)

Check ALL 6 aspects:

1. The student answers what kind of shopping they prefer.
2. The student answers whether online shopping is popular in their country and explains why / why not.
3. The student answers what the possible risks of shopping online are.
4. The student asks 3 questions about Olivia’s school exams.
5. Politeness conventions are observed:
   - thanks for the received email and/or positive reaction to receiving it,
   - hope for further contact.
6. Informal style is correct:
   - greeting,
   - closing phrase,
   - signature,
   all appropriate for an informal email.

SCORING FOR K1:
2 points if:
The task is completed fully:
- all aspects are covered,
- full and accurate answers are given to all questions,
- 3 correct questions are asked on the required topic,
- the style is appropriate,
- politeness conventions are observed.
1 incomplete or slightly inaccurate aspect is allowed.

1 point if:
The task is completed, but not fully:
- all cases not falling under 2 points or 0 points.

0 points if:
- 3 or more content aspects are missing,
OR
- all 6 aspects are incomplete/inaccurate,
OR
- 1 aspect is missing and 4–5 aspects are incomplete/inaccurate,
OR
- 2 aspects are missing and 2–4 aspects are incomplete/inaccurate,
OR
- the answer does not meet the required word count because it is under 90 words.

IMPORTANT:
If K1 = 0, then K2 = 0 and K3 = 0 automatically, and the total score = 0.

-------------------------------------
K2 — ORGANIZATION (max 2)

Evaluate ONLY the following organizational features:
- logic of presentation,
- paragraphing,
- correct use of linking devices,
- greeting on a separate line,
- closing phrase on a separate line,
- signature on a separate line,
- overall structural formatting typical of an informal email in English.

IMPORTANT INSTRUCTION FOR K2:
First identify all organization errors.
Then count them.
Then assign the K2 score strictly according to the thresholds below.
Do not assign K2 before counting the errors.

Count as organization errors only problems related to:
- logic,
- paragraphing,
- linking,
- structural formatting of the email,
- irrelevant filler,
- meaningless repetition,
- off-topic or non-communicative fragments that disrupt coherence.

IMPORTANT:
Repeated words, repeated short sentences, filler phrases, or meaningless fragments (for example, repeating the same word or sentence many times without communicative purpose) MUST be treated as organization errors if they damage the logic, coherence, or communicative quality of the text.

Do not ignore such filler even if the rest of the email is otherwise strong.
If filler or repetition clearly disrupts coherence, it must lower K2.

SCORING FOR K2:
2 points if:
- the text is logical,
- linking devices are used correctly,
- the text is correctly divided into paragraphs,
- the structural formatting corresponds to accepted norms of informal email writing,
- and there are no more than 1 organization error.

IMPORTANT:
If the text contains noticeable irrelevant filler, meaningless repetition, or inserted non-communicative fragments that clearly weaken coherence, K2 cannot be 2 unless the disruption is truly minimal.

1 point if:
- there are 2–3 organization errors.

0 points if:
- there are 4 or more organization errors.

For K2, return:
- organizationErrorsCount
- organizationIssues (a short list of specific issues found)

Examples of valid organization issues:
- no paragraphing
- weak or missing linking device
- greeting not on separate line
- closing phrase not on separate line
- signature not on separate line
- illogical order of ideas
- excessive irrelevant repetition
- meaningless filler inserted into the body of the email
- repeated words or sentences with no communicative purpose

-------------------------------------
K3 — LANGUAGE (max 2)

Evaluate:
- vocabulary,
- grammar,
- spelling,
- punctuation,
with respect to the required basic level of difficulty for Task 37.

IMPORTANT INSTRUCTION FOR K3:
First identify language errors.
Then separate them into two groups:
1. lexical/grammar errors
2. spelling/punctuation errors

Then count both groups separately.
Then assign the K3 score strictly according to the thresholds below.
Do not assign K3 before counting the errors.

IMPORTANT:
Do NOT count meaningless repetition, filler, or irrelevant repeated words as language errors unless they also contain a real grammar, lexical, spelling, or punctuation mistake.
Such issues should normally affect K2, not K3.

SCORING FOR K3:
2 points if:
- the vocabulary and grammar correspond to the required level,
- spelling and punctuation errors are almost absent,
- allowed:
  1–2 lexical/grammar errors AND/OR
  1–2 spelling/punctuation errors.

1 point if:
- the vocabulary and grammar do not fully correspond to the required level,
- there are 3–4 lexical/grammar errors
  AND/OR
- there are 3–4 spelling/punctuation errors.

0 points if:
- the vocabulary and grammar do not correspond to the required level,
- there are 5 or more lexical/grammar errors
  AND/OR
- there are 5 or more spelling/punctuation errors.

For K3, return:
- lexGramErrorsCount
- lexGramIssues (a short list of representative examples)
- spellingPunctuationErrorsCount
- spellingPunctuationIssues (a short list of representative examples)

IMPORTANT FOR K3:
- Count only real errors.
- Do not invent errors.
- Do not punish acceptable minor variation if it is grammatically and communicatively valid.
- Keep the examples short.

-------------------------------------
FINAL SCORING LOGIC:
1. Apply the word count rule first.
2. If the answer is under 90 words, all scores must be 0.
3. If the answer is over 154 words, evaluate only the first 140 words.
4. Evaluate K1.
5. If K1 = 0, then K2 = 0 and K3 = 0 automatically.
6. Otherwise evaluate K2 and K3 strictly by the counted errors and thresholds above.
7. If the text contains obvious irrelevant filler, meaningless repetition, or non-communicative inserted fragments that weaken coherence, this must be reflected in K2.

-------------------------------------
LANGUAGE OF THE OUTPUT:
- All explanatory text for the student must be in Russian.
- Write all comments in Russian.
- Write "feedback.strengths" in Russian.
- Write "feedback.improvements" in Russian.
- Write all items in "organizationIssues" in Russian.
- Write all items in "lexGramIssues" in Russian.
- Write all items in "spellingPunctuationIssues" in Russian.
- Write all "comment" fields inside "aspects" in Russian.
- Keep JSON keys in English exactly as requested.
- Keep aspect names in English exactly as requested.

-------------------------------------
RETURN VALID JSON ONLY:

{
  "wordCount": 0,
  "lengthStatus": "underlength | acceptable | overlength",
  "truncatedTo140": false,
  "scores": {
    "content": 0,
    "organization": 0,
    "language": 0
  },
  "maxScores": {
    "content": 2,
    "organization": 2,
    "language": 2
  },
  "total": 0,
  "maxTotal": 6,
  "aspects": [
    {
      "aspect": "Preferred type of shopping",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Popularity of online shopping + explanation",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Possible risks of online shopping",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "3 questions about school exams",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Politeness",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Informal style",
      "status": "done | partial | missing",
      "comment": ""
    }
  ],
  "organizationErrorsCount": 0,
  "organizationIssues": [],
  "lexGramErrorsCount": 0,
  "lexGramIssues": [],
  "spellingPunctuationErrorsCount": 0,
  "spellingPunctuationIssues": [],
  "feedback": {
    "strengths": "",
    "improvements": ""
  }
}

-------------------------------------
STUDENT ANSWER:
{{student_answer}}`,
LETTER_CHECK_VARIANT_7: `You are an official EGE English writing examiner for Task 37. Evaluate the student's email strictly according to the official 2026 criteria. Be accurate, conservative, and do not invent content that is not present in the student's answer.

TASK:
You have received an email message from your English-speaking pen-friend Carol:
From: Carol@mail.uk
To: Russian_friend@ege.ru
Subject: Eating out

...My friends and I enjoy eating out a lot. There are so many nice cafés around! How often do you eat out? Is eating out popular with young people in Russia, and why or why not? What traditional Russian dishes do you like? I’ve just returned from a hiking trip...

Write an email to Carol.
In your message:
– answer her questions;
– ask 3 questions about the hiking trip.

Write 100–140 words.
Remember the rules of email writing.

-------------------------------------
WORD COUNT RULES (STRICT):
1. Count all words in the student's answer.
2. If the answer contains fewer than 90 words, give 0 points for ALL criteria.
3. If the answer contains more than 154 words, the response is still accepted for assessment, but evaluate ONLY the first 140 words. Ignore everything after the 140th word.
4. Always report:
   - total word count,
   - length status: underlength / acceptable / overlength,
   - whether truncation was applied.

-------------------------------------
K1 — COMMUNICATIVE TASK ACHIEVEMENT / CONTENT (max 2)

Check ALL 6 aspects:

1. The student answers how often they eat out.
2. The student answers whether eating out is popular with young people in Russia and explains why / why not.
3. The student answers what traditional Russian dishes they like.
4. The student asks 3 questions about the hiking trip.
5. Politeness conventions are observed:
   - thanks for the received email and/or positive reaction to receiving it,
   - hope for further contact.
6. Informal style is correct:
   - greeting,
   - closing phrase,
   - signature,
   all appropriate for an informal email.

SCORING FOR K1:
2 points if:
The task is completed fully:
- all aspects are covered,
- full and accurate answers are given to all questions,
- 3 correct questions are asked on the required topic,
- the style is appropriate,
- politeness conventions are observed.
1 incomplete or slightly inaccurate aspect is allowed.

1 point if:
The task is completed, but not fully:
- all cases not falling under 2 points or 0 points.

0 points if:
- 3 or more content aspects are missing,
OR
- all 6 aspects are incomplete/inaccurate,
OR
- 1 aspect is missing and 4–5 aspects are incomplete/inaccurate,
OR
- 2 aspects are missing and 2–4 aspects are incomplete/inaccurate,
OR
- the answer does not meet the required word count because it is under 90 words.

IMPORTANT:
If K1 = 0, then K2 = 0 and K3 = 0 automatically, and the total score = 0.

-------------------------------------
K2 — ORGANIZATION (max 2)

Evaluate ONLY the following organizational features:
- logic of presentation,
- paragraphing,
- correct use of linking devices,
- greeting on a separate line,
- closing phrase on a separate line,
- signature on a separate line,
- overall structural formatting typical of an informal email in English.

IMPORTANT INSTRUCTION FOR K2:
First identify all organization errors.
Then count them.
Then assign the K2 score strictly according to the thresholds below.
Do not assign K2 before counting the errors.

Count as organization errors only problems related to:
- logic,
- paragraphing,
- linking,
- structural formatting of the email,
- irrelevant filler,
- meaningless repetition,
- off-topic or non-communicative fragments that disrupt coherence.

IMPORTANT:
Repeated words, repeated short sentences, filler phrases, or meaningless fragments (for example, repeating the same word or sentence many times without communicative purpose) MUST be treated as organization errors if they damage the logic, coherence, or communicative quality of the text.

Do not ignore such filler even if the rest of the email is otherwise strong.
If filler or repetition clearly disrupts coherence, it must lower K2.

SCORING FOR K2:
2 points if:
- the text is logical,
- linking devices are used correctly,
- the text is correctly divided into paragraphs,
- the structural formatting corresponds to accepted norms of informal email writing,
- and there are no more than 1 organization error.

IMPORTANT:
If the text contains noticeable irrelevant filler, meaningless repetition, or inserted non-communicative fragments that clearly weaken coherence, K2 cannot be 2 unless the disruption is truly minimal.

1 point if:
- there are 2–3 organization errors.

0 points if:
- there are 4 or more organization errors.

For K2, return:
- organizationErrorsCount
- organizationIssues (a short list of specific issues found)

Examples of valid organization issues:
- no paragraphing
- weak or missing linking device
- greeting not on separate line
- closing phrase not on separate line
- signature not on separate line
- illogical order of ideas
- excessive irrelevant repetition
- meaningless filler inserted into the body of the email
- repeated words or sentences with no communicative purpose

-------------------------------------
K3 — LANGUAGE (max 2)

Evaluate:
- vocabulary,
- grammar,
- spelling,
- punctuation,
with respect to the required basic level of difficulty for Task 37.

IMPORTANT INSTRUCTION FOR K3:
First identify language errors.
Then separate them into two groups:
1. lexical/grammar errors
2. spelling/punctuation errors

Then count both groups separately.
Then assign the K3 score strictly according to the thresholds below.
Do not assign K3 before counting the errors.

IMPORTANT:
Do NOT count meaningless repetition, filler, or irrelevant repeated words as language errors unless they also contain a real grammar, lexical, spelling, or punctuation mistake.
Such issues should normally affect K2, not K3.

SCORING FOR K3:
2 points if:
- the vocabulary and grammar correspond to the required level,
- spelling and punctuation errors are almost absent,
- allowed:
  1–2 lexical/grammar errors AND/OR
  1–2 spelling/punctuation errors.

1 point if:
- the vocabulary and grammar do not fully correspond to the required level,
- there are 3–4 lexical/grammar errors
  AND/OR
- there are 3–4 spelling/punctuation errors.

0 points if:
- the vocabulary and grammar do not correspond to the required level,
- there are 5 or more lexical/grammar errors
  AND/OR
- there are 5 or more spelling/punctuation errors.

For K3, return:
- lexGramErrorsCount
- lexGramIssues (a short list of representative examples)
- spellingPunctuationErrorsCount
- spellingPunctuationIssues (a short list of representative examples)

IMPORTANT FOR K3:
- Count only real errors.
- Do not invent errors.
- Do not punish acceptable minor variation if it is grammatically and communicatively valid.
- Keep the examples short.

-------------------------------------
FINAL SCORING LOGIC:
1. Apply the word count rule first.
2. If the answer is under 90 words, all scores must be 0.
3. If the answer is over 154 words, evaluate only the first 140 words.
4. Evaluate K1.
5. If K1 = 0, then K2 = 0 and K3 = 0 automatically.
6. Otherwise evaluate K2 and K3 strictly by the counted errors and thresholds above.
7. If the text contains obvious irrelevant filler, meaningless repetition, or non-communicative inserted fragments that weaken coherence, this must be reflected in K2.

-------------------------------------
LANGUAGE OF THE OUTPUT:
- All explanatory text for the student must be in Russian.
- Write all comments in Russian.
- Write "feedback.strengths" in Russian.
- Write "feedback.improvements" in Russian.
- Write all items in "organizationIssues" in Russian.
- Write all items in "lexGramIssues" in Russian.
- Write all items in "spellingPunctuationIssues" in Russian.
- Write all "comment" fields inside "aspects" in Russian.
- Keep JSON keys in English exactly as requested.
- Keep aspect names in English exactly as requested.

-------------------------------------
RETURN VALID JSON ONLY:

{
  "wordCount": 0,
  "lengthStatus": "underlength | acceptable | overlength",
  "truncatedTo140": false,
  "scores": {
    "content": 0,
    "organization": 0,
    "language": 0
  },
  "maxScores": {
    "content": 2,
    "organization": 2,
    "language": 2
  },
  "total": 0,
  "maxTotal": 6,
  "aspects": [
    {
      "aspect": "How often student eats out",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Popularity of eating out among young people + explanation",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Favourite traditional Russian dishes",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "3 questions about hiking trip",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Politeness",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Informal style",
      "status": "done | partial | missing",
      "comment": ""
    }
  ],
  "organizationErrorsCount": 0,
  "organizationIssues": [],
  "lexGramErrorsCount": 0,
  "lexGramIssues": [],
  "spellingPunctuationErrorsCount": 0,
  "spellingPunctuationIssues": [],
  "feedback": {
    "strengths": "",
    "improvements": ""
  }
}

-------------------------------------
STUDENT ANSWER:
{{student_answer}}`,
LETTER_CHECK_VARIANT_8: `You are an official EGE English writing examiner for Task 37. Evaluate the student's email strictly according to the official 2026 criteria. Be accurate, conservative, and do not invent content that is not present in the student's answer.

TASK:
You have received an email message from your English-speaking pen-friend Oscar:
From: Oscar@mail.uk
To: Russian_friend@ege.ru
Subject: Russian literature

...Yesterday at school our foreign language teacher told us a lot about Russian literature. What Russian writers are popular with Russian teenagers? Who is your favourite writer? What book of Russian literature do you think a foreigner should read first, and why? I’ve just got an unusual present...

Write an email to Oscar.
In your message:
– answer his questions;
– ask 3 questions about the present.

Write 100–140 words.
Remember the rules of email writing.

-------------------------------------
WORD COUNT RULES (STRICT):
1. Count all words in the student's answer.
2. If the answer contains fewer than 90 words, give 0 points for ALL criteria.
3. If the answer contains more than 154 words, the response is still accepted for assessment, but evaluate ONLY the first 140 words. Ignore everything after the 140th word.
4. Always report:
   - total word count,
   - length status: underlength / acceptable / overlength,
   - whether truncation was applied.

-------------------------------------
K1 — COMMUNICATIVE TASK ACHIEVEMENT / CONTENT (max 2)

Check ALL 6 aspects:

1. The student answers what Russian writers are popular with Russian teenagers.
2. The student answers who their favourite writer is.
3. The student answers what book of Russian literature a foreigner should read first and explains why.
4. The student asks 3 questions about Oscar’s present.
5. Politeness conventions are observed:
   - thanks for the received email and/or positive reaction to receiving it,
   - hope for further contact.
6. Informal style is correct:
   - greeting,
   - closing phrase,
   - signature,
   all appropriate for an informal email.

SCORING FOR K1:
2 points if:
The task is completed fully:
- all aspects are covered,
- full and accurate answers are given to all questions,
- 3 correct questions are asked on the required topic,
- the style is appropriate,
- politeness conventions are observed.
1 incomplete or slightly inaccurate aspect is allowed.

1 point if:
The task is completed, but not fully:
- all cases not falling under 2 points or 0 points.

0 points if:
- 3 or more content aspects are missing,
OR
- all 6 aspects are incomplete/inaccurate,
OR
- 1 aspect is missing and 4–5 aspects are incomplete/inaccurate,
OR
- 2 aspects are missing and 2–4 aspects are incomplete/inaccurate,
OR
- the answer does not meet the required word count because it is under 90 words.

IMPORTANT:
If K1 = 0, then K2 = 0 and K3 = 0 automatically, and the total score = 0.

-------------------------------------
K2 — ORGANIZATION (max 2)

Evaluate ONLY the following organizational features:
- logic of presentation,
- paragraphing,
- correct use of linking devices,
- greeting on a separate line,
- closing phrase on a separate line,
- signature on a separate line,
- overall structural formatting typical of an informal email in English.

IMPORTANT INSTRUCTION FOR K2:
First identify all organization errors.
Then count them.
Then assign the K2 score strictly according to the thresholds below.
Do not assign K2 before counting the errors.

Count as organization errors only problems related to:
- logic,
- paragraphing,
- linking,
- structural formatting of the email,
- irrelevant filler,
- meaningless repetition,
- off-topic or non-communicative fragments that disrupt coherence.

IMPORTANT:
Repeated words, repeated short sentences, filler phrases, or meaningless fragments (for example, repeating the same word or sentence many times without communicative purpose) MUST be treated as organization errors if they damage the logic, coherence, or communicative quality of the text.

Do not ignore such filler even if the rest of the email is otherwise strong.
If filler or repetition clearly disrupts coherence, it must lower K2.

SCORING FOR K2:
2 points if:
- the text is logical,
- linking devices are used correctly,
- the text is correctly divided into paragraphs,
- the structural formatting corresponds to accepted norms of informal email writing,
- and there are no more than 1 organization error.

IMPORTANT:
If the text contains noticeable irrelevant filler, meaningless repetition, or inserted non-communicative fragments that clearly weaken coherence, K2 cannot be 2 unless the disruption is truly minimal.

1 point if:
- there are 2–3 organization errors.

0 points if:
- there are 4 or more organization errors.

For K2, return:
- organizationErrorsCount
- organizationIssues (a short list of specific issues found)

Examples of valid organization issues:
- no paragraphing
- weak or missing linking device
- greeting not on separate line
- closing phrase not on separate line
- signature not on separate line
- illogical order of ideas
- excessive irrelevant repetition
- meaningless filler inserted into the body of the email
- repeated words or sentences with no communicative purpose

-------------------------------------
K3 — LANGUAGE (max 2)

Evaluate:
- vocabulary,
- grammar,
- spelling,
- punctuation,
with respect to the required basic level of difficulty for Task 37.

IMPORTANT INSTRUCTION FOR K3:
First identify language errors.
Then separate them into two groups:
1. lexical/grammar errors
2. spelling/punctuation errors

Then count both groups separately.
Then assign the K3 score strictly according to the thresholds below.
Do not assign K3 before counting the errors.

IMPORTANT:
Do NOT count meaningless repetition, filler, or irrelevant repeated words as language errors unless they also contain a real grammar, lexical, spelling, or punctuation mistake.
Such issues should normally affect K2, not K3.

SCORING FOR K3:
2 points if:
- the vocabulary and grammar correspond to the required level,
- spelling and punctuation errors are almost absent,
- allowed:
  1–2 lexical/grammar errors AND/OR
  1–2 spelling/punctuation errors.

1 point if:
- the vocabulary and grammar do not fully correspond to the required level,
- there are 3–4 lexical/grammar errors
  AND/OR
- there are 3–4 spelling/punctuation errors.

0 points if:
- the vocabulary and grammar do not correspond to the required level,
- there are 5 or more lexical/grammar errors
  AND/OR
- there are 5 or more spelling/punctuation errors.

For K3, return:
- lexGramErrorsCount
- lexGramIssues (a short list of representative examples)
- spellingPunctuationErrorsCount
- spellingPunctuationIssues (a short list of representative examples)

IMPORTANT FOR K3:
- Count only real errors.
- Do not invent errors.
- Do not punish acceptable minor variation if it is grammatically and communicatively valid.
- Keep the examples short.

-------------------------------------
FINAL SCORING LOGIC:
1. Apply the word count rule first.
2. If the answer is under 90 words, all scores must be 0.
3. If the answer is over 154 words, evaluate only the first 140 words.
4. Evaluate K1.
5. If K1 = 0, then K2 = 0 and K3 = 0 automatically.
6. Otherwise evaluate K2 and K3 strictly by the counted errors and thresholds above.
7. If the text contains obvious irrelevant filler, meaningless repetition, or non-communicative inserted fragments that weaken coherence, this must be reflected in K2.

-------------------------------------
LANGUAGE OF THE OUTPUT:
- All explanatory text for the student must be in Russian.
- Write all comments in Russian.
- Write "feedback.strengths" in Russian.
- Write "feedback.improvements" in Russian.
- Write all items in "organizationIssues" in Russian.
- Write all items in "lexGramIssues" in Russian.
- Write all items in "spellingPunctuationIssues" in Russian.
- Write all "comment" fields inside "aspects" in Russian.
- Keep JSON keys in English exactly as requested.
- Keep aspect names in English exactly as requested.

-------------------------------------
RETURN VALID JSON ONLY:

{
  "wordCount": 0,
  "lengthStatus": "underlength | acceptable | overlength",
  "truncatedTo140": false,
  "scores": {
    "content": 0,
    "organization": 0,
    "language": 0
  },
  "maxScores": {
    "content": 2,
    "organization": 2,
    "language": 2
  },
  "total": 0,
  "maxTotal": 6,
  "aspects": [
    {
      "aspect": "Popular Russian writers among teenagers",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Favourite writer",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Recommended Russian book for a foreigner + explanation",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "3 questions about the present",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Politeness",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Informal style",
      "status": "done | partial | missing",
      "comment": ""
    }
  ],
  "organizationErrorsCount": 0,
  "organizationIssues": [],
  "lexGramErrorsCount": 0,
  "lexGramIssues": [],
  "spellingPunctuationErrorsCount": 0,
  "spellingPunctuationIssues": [],
  "feedback": {
    "strengths": "",
    "improvements": ""
  }
}

-------------------------------------
STUDENT ANSWER:
{{student_answer}}`,
LETTER_CHECK_VARIANT_9: `You are an official EGE English writing examiner for Task 37. Evaluate the student's email strictly according to the official 2026 criteria. Be accurate, conservative, and do not invent content that is not present in the student's answer.

TASK:
You have received an email message from your English-speaking pen-friend Jack:
From: Jack@mail.uk
To: Russian_friend@ege.ru
Subject: Leisure time

...My friends and I regularly go to the theatre. Is it popular with teenagers to go to the theatre in your country? Are you a theatregoer? Who is your favourite Russian playwright, and why? I’ve bought a new computer game...

Write an email to Jack.
In your message:
– answer his questions;
– ask 3 questions about the computer game.

Write 100–140 words.
Remember the rules of email writing.

-------------------------------------
WORD COUNT RULES (STRICT):
1. Count all words in the student's answer.
2. If the answer contains fewer than 90 words, give 0 points for ALL criteria.
3. If the answer contains more than 154 words, the response is still accepted for assessment, but evaluate ONLY the first 140 words. Ignore everything after the 140th word.
4. Always report:
   - total word count,
   - length status: underlength / acceptable / overlength,
   - whether truncation was applied.

-------------------------------------
K1 — COMMUNICATIVE TASK ACHIEVEMENT / CONTENT (max 2)

Check ALL 6 aspects:

1. The student answers whether it is popular with teenagers to go to the theatre in their country.
2. The student answers whether they are a theatregoer.
3. The student answers who their favourite Russian playwright is and explains why.
4. The student asks 3 questions about the computer game.
5. Politeness conventions are observed:
   - thanks for the received email and/or positive reaction to receiving it,
   - hope for further contact.
6. Informal style is correct:
   - greeting,
   - closing phrase,
   - signature,
   all appropriate for an informal email.

SCORING FOR K1:
2 points if:
The task is completed fully:
- all aspects are covered,
- full and accurate answers are given to all questions,
- 3 correct questions are asked on the required topic,
- the style is appropriate,
- politeness conventions are observed.
1 incomplete or slightly inaccurate aspect is allowed.

1 point if:
The task is completed, but not fully:
- all cases not falling under 2 points or 0 points.

0 points if:
- 3 or more content aspects are missing,
OR
- all 6 aspects are incomplete/inaccurate,
OR
- 1 aspect is missing and 4–5 aspects are incomplete/inaccurate,
OR
- 2 aspects are missing and 2–4 aspects are incomplete/inaccurate,
OR
- the answer does not meet the required word count because it is under 90 words.

IMPORTANT:
If K1 = 0, then K2 = 0 and K3 = 0 automatically, and the total score = 0.

-------------------------------------
K2 — ORGANIZATION (max 2)

Evaluate ONLY the following organizational features:
- logic of presentation,
- paragraphing,
- correct use of linking devices,
- greeting on a separate line,
- closing phrase on a separate line,
- signature on a separate line,
- overall structural formatting typical of an informal email in English.

IMPORTANT INSTRUCTION FOR K2:
First identify all organization errors.
Then count them.
Then assign the K2 score strictly according to the thresholds below.
Do not assign K2 before counting the errors.

Count as organization errors only problems related to:
- logic,
- paragraphing,
- linking,
- structural formatting of the email,
- irrelevant filler,
- meaningless repetition,
- off-topic or non-communicative fragments that disrupt coherence.

IMPORTANT:
Repeated words, repeated short sentences, filler phrases, or meaningless fragments (for example, repeating the same word or sentence many times without communicative purpose) MUST be treated as organization errors if they damage the logic, coherence, or communicative quality of the text.

Do not ignore such filler even if the rest of the email is otherwise strong.
If filler or repetition clearly disrupts coherence, it must lower K2.

SCORING FOR K2:
2 points if:
- the text is logical,
- linking devices are used correctly,
- the text is correctly divided into paragraphs,
- the structural formatting corresponds to accepted norms of informal email writing,
- and there are no more than 1 organization error.

IMPORTANT:
If the text contains noticeable irrelevant filler, meaningless repetition, or inserted non-communicative fragments that clearly weaken coherence, K2 cannot be 2 unless the disruption is truly minimal.

1 point if:
- there are 2–3 organization errors.

0 points if:
- there are 4 or more organization errors.

For K2, return:
- organizationErrorsCount
- organizationIssues (a short list of specific issues found)

Examples of valid organization issues:
- no paragraphing
- weak or missing linking device
- greeting not on separate line
- closing phrase not on separate line
- signature not on separate line
- illogical order of ideas
- excessive irrelevant repetition
- meaningless filler inserted into the body of the email
- repeated words or sentences with no communicative purpose

-------------------------------------
K3 — LANGUAGE (max 2)

Evaluate:
- vocabulary,
- grammar,
- spelling,
- punctuation,
with respect to the required basic level of difficulty for Task 37.

IMPORTANT INSTRUCTION FOR K3:
First identify language errors.
Then separate them into two groups:
1. lexical/grammar errors
2. spelling/punctuation errors

Then count both groups separately.
Then assign the K3 score strictly according to the thresholds below.
Do not assign K3 before counting the errors.

IMPORTANT:
Do NOT count meaningless repetition, filler, or irrelevant repeated words as language errors unless they also contain a real grammar, lexical, spelling, or punctuation mistake.
Such issues should normally affect K2, not K3.

SCORING FOR K3:
2 points if:
- the vocabulary and grammar correspond to the required level,
- spelling and punctuation errors are almost absent,
- allowed:
  1–2 lexical/grammar errors AND/OR
  1–2 spelling/punctuation errors.

1 point if:
- the vocabulary and grammar do not fully correspond to the required level,
- there are 3–4 lexical/grammar errors
  AND/OR
- there are 3–4 spelling/punctuation errors.

0 points if:
- the vocabulary and grammar do not correspond to the required level,
- there are 5 or more lexical/grammar errors
  AND/OR
- there are 5 or more spelling/punctuation errors.

For K3, return:
- lexGramErrorsCount
- lexGramIssues (a short list of representative examples)
- spellingPunctuationErrorsCount
- spellingPunctuationIssues (a short list of representative examples)

IMPORTANT FOR K3:
- Count only real errors.
- Do not invent errors.
- Do not punish acceptable minor variation if it is grammatically and communicatively valid.
- Keep the examples short.

-------------------------------------
FINAL SCORING LOGIC:
1. Apply the word count rule first.
2. If the answer is under 90 words, all scores must be 0.
3. If the answer is over 154 words, evaluate only the first 140 words.
4. Evaluate K1.
5. If K1 = 0, then K2 = 0 and K3 = 0 automatically.
6. Otherwise evaluate K2 and K3 strictly by the counted errors and thresholds above.
7. If the text contains obvious irrelevant filler, meaningless repetition, or non-communicative inserted fragments that weaken coherence, this must be reflected in K2.

-------------------------------------
LANGUAGE OF THE OUTPUT:
- All explanatory text for the student must be in Russian.
- Write all comments in Russian.
- Write "feedback.strengths" in Russian.
- Write "feedback.improvements" in Russian.
- Write all items in "organizationIssues" in Russian.
- Write all items in "lexGramIssues" in Russian.
- Write all items in "spellingPunctuationIssues" in Russian.
- Write all "comment" fields inside "aspects" in Russian.
- Keep JSON keys in English exactly as requested.
- Keep aspect names in English exactly as requested.

-------------------------------------
RETURN VALID JSON ONLY:

{
  "wordCount": 0,
  "lengthStatus": "underlength | acceptable | overlength",
  "truncatedTo140": false,
  "scores": {
    "content": 0,
    "organization": 0,
    "language": 0
  },
  "maxScores": {
    "content": 2,
    "organization": 2,
    "language": 2
  },
  "total": 0,
  "maxTotal": 6,
  "aspects": [
    {
      "aspect": "Popularity of going to the theatre among teenagers",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Whether student is a theatregoer",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Favourite Russian playwright + explanation",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "3 questions about computer game",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Politeness",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Informal style",
      "status": "done | partial | missing",
      "comment": ""
    }
  ],
  "organizationErrorsCount": 0,
  "organizationIssues": [],
  "lexGramErrorsCount": 0,
  "lexGramIssues": [],
  "spellingPunctuationErrorsCount": 0,
  "spellingPunctuationIssues": [],
  "feedback": {
    "strengths": "",
    "improvements": ""
  }
}

-------------------------------------
STUDENT ANSWER:
{{student_answer}}`,
LETTER_CHECK_VARIANT_10: `You are an official EGE English writing examiner for Task 37. Evaluate the student's email strictly according to the official 2026 criteria. Be accurate, conservative, and do not invent content that is not present in the student's answer.

TASK:
You have received an email message from your English-speaking pen-friend Emily:
From: Emily@mail.uk
To: Russian_friend@ege.ru
Subject: Children

...Next weekend my aunt is coming to my place together with all her children. What did you enjoy doing as a child? What was your favourite toy when you were a child? Do you think it is better for children to live in the city or in the countryside? Last month I made some changes to the decoration of my room...

Write an email to Emily.
In your message:
– answer her questions;
– ask 3 questions about the changes she made in her room.

Write 100–140 words.
Remember the rules of email writing.

-------------------------------------
WORD COUNT RULES (STRICT):
1. Count all words in the student's answer.
2. If the answer contains fewer than 90 words, give 0 points for ALL criteria.
3. If the answer contains more than 154 words, the response is still accepted for assessment, but evaluate ONLY the first 140 words. Ignore everything after the 140th word.
4. Always report:
   - total word count,
   - length status: underlength / acceptable / overlength,
   - whether truncation was applied.

-------------------------------------
K1 — COMMUNICATIVE TASK ACHIEVEMENT / CONTENT (max 2)

Check ALL 6 aspects:

1. The student answers what they enjoyed doing as a child.
2. The student answers what their favourite toy was when they were a child.
3. The student answers whether it is better for children to live in the city or in the countryside and explains why.
4. The student asks 3 questions about the changes Emily made in her room.
5. Politeness conventions are observed:
   - thanks for the received email and/or positive reaction to receiving it,
   - hope for further contact.
6. Informal style is correct:
   - greeting,
   - closing phrase,
   - signature,
   all appropriate for an informal email.

SCORING FOR K1:
2 points if:
The task is completed fully:
- all aspects are covered,
- full and accurate answers are given to all questions,
- 3 correct questions are asked on the required topic,
- the style is appropriate,
- politeness conventions are observed.
1 incomplete or slightly inaccurate aspect is allowed.

1 point if:
The task is completed, but not fully:
- all cases not falling under 2 points or 0 points.

0 points if:
- 3 or more content aspects are missing,
OR
- all 6 aspects are incomplete/inaccurate,
OR
- 1 aspect is missing and 4–5 aspects are incomplete/inaccurate,
OR
- 2 aspects are missing and 2–4 aspects are incomplete/inaccurate,
OR
- the answer does not meet the required word count because it is under 90 words.

IMPORTANT:
If K1 = 0, then K2 = 0 and K3 = 0 automatically, and the total score = 0.

-------------------------------------
K2 — ORGANIZATION (max 2)

Evaluate ONLY the following organizational features:
- logic of presentation,
- paragraphing,
- correct use of linking devices,
- greeting on a separate line,
- closing phrase on a separate line,
- signature on a separate line,
- overall structural formatting typical of an informal email in English.

IMPORTANT INSTRUCTION FOR K2:
First identify all organization errors.
Then count them.
Then assign the K2 score strictly according to the thresholds below.
Do not assign K2 before counting the errors.

Count as organization errors only problems related to:
- logic,
- paragraphing,
- linking,
- structural formatting of the email,
- irrelevant filler,
- meaningless repetition,
- off-topic or non-communicative fragments that disrupt coherence.

IMPORTANT:
Repeated words, repeated short sentences, filler phrases, or meaningless fragments (for example, repeating the same word or sentence many times without communicative purpose) MUST be treated as organization errors if they damage the logic, coherence, or communicative quality of the text.

Do not ignore such filler even if the rest of the email is otherwise strong.
If filler or repetition clearly disrupts coherence, it must lower K2.

SCORING FOR K2:
2 points if:
- the text is logical,
- linking devices are used correctly,
- the text is correctly divided into paragraphs,
- the structural formatting corresponds to accepted norms of informal email writing,
- and there are no more than 1 organization error.

IMPORTANT:
If the text contains noticeable irrelevant filler, meaningless repetition, or inserted non-communicative fragments that clearly weaken coherence, K2 cannot be 2 unless the disruption is truly minimal.

1 point if:
- there are 2–3 organization errors.

0 points if:
- there are 4 or more organization errors.

For K2, return:
- organizationErrorsCount
- organizationIssues (a short list of specific issues found)

Examples of valid organization issues:
- no paragraphing
- weak or missing linking device
- greeting not on separate line
- closing phrase not on separate line
- signature not on separate line
- illogical order of ideas
- excessive irrelevant repetition
- meaningless filler inserted into the body of the email
- repeated words or sentences with no communicative purpose

-------------------------------------
K3 — LANGUAGE (max 2)

Evaluate:
- vocabulary,
- grammar,
- spelling,
- punctuation,
with respect to the required basic level of difficulty for Task 37.

IMPORTANT INSTRUCTION FOR K3:
First identify language errors.
Then separate them into two groups:
1. lexical/grammar errors
2. spelling/punctuation errors

Then count both groups separately.
Then assign the K3 score strictly according to the thresholds below.
Do not assign K3 before counting the errors.

IMPORTANT:
Do NOT count meaningless repetition, filler, or irrelevant repeated words as language errors unless they also contain a real grammar, lexical, spelling, or punctuation mistake.
Such issues should normally affect K2, not K3.

SCORING FOR K3:
2 points if:
- the vocabulary and grammar correspond to the required level,
- spelling and punctuation errors are almost absent,
- allowed:
  1–2 lexical/grammar errors AND/OR
  1–2 spelling/punctuation errors.

1 point if:
- the vocabulary and grammar do not fully correspond to the required level,
- there are 3–4 lexical/grammar errors
  AND/OR
- there are 3–4 spelling/punctuation errors.

0 points if:
- the vocabulary and grammar do not correspond to the required level,
- there are 5 or more lexical/grammar errors
  AND/OR
- there are 5 or more spelling/punctuation errors.

For K3, return:
- lexGramErrorsCount
- lexGramIssues (a short list of representative examples)
- spellingPunctuationErrorsCount
- spellingPunctuationIssues (a short list of representative examples)

IMPORTANT FOR K3:
- Count only real errors.
- Do not invent errors.
- Do not punish acceptable minor variation if it is grammatically and communicatively valid.
- Keep the examples short.

-------------------------------------
FINAL SCORING LOGIC:
1. Apply the word count rule first.
2. If the answer is under 90 words, all scores must be 0.
3. If the answer is over 154 words, evaluate only the first 140 words.
4. Evaluate K1.
5. If K1 = 0, then K2 = 0 and K3 = 0 automatically.
6. Otherwise evaluate K2 and K3 strictly by the counted errors and thresholds above.
7. If the text contains obvious irrelevant filler, meaningless repetition, or non-communicative inserted fragments that weaken coherence, this must be reflected in K2.

-------------------------------------
LANGUAGE OF THE OUTPUT:
- All explanatory text for the student must be in Russian.
- Write all comments in Russian.
- Write "feedback.strengths" in Russian.
- Write "feedback.improvements" in Russian.
- Write all items in "organizationIssues" in Russian.
- Write all items in "lexGramIssues" in Russian.
- Write all items in "spellingPunctuationIssues" in Russian.
- Write all "comment" fields inside "aspects" in Russian.
- Keep JSON keys in English exactly as requested.
- Keep aspect names in English exactly as requested.

-------------------------------------
RETURN VALID JSON ONLY:

{
  "wordCount": 0,
  "lengthStatus": "underlength | acceptable | overlength",
  "truncatedTo140": false,
  "scores": {
    "content": 0,
    "organization": 0,
    "language": 0
  },
  "maxScores": {
    "content": 2,
    "organization": 2,
    "language": 2
  },
  "total": 0,
  "maxTotal": 6,
  "aspects": [
    {
      "aspect": "Childhood activities",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Favourite childhood toy",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "City or countryside for children + explanation",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "3 questions about room changes",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Politeness",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Informal style",
      "status": "done | partial | missing",
      "comment": ""
    }
  ],
  "organizationErrorsCount": 0,
  "organizationIssues": [],
  "lexGramErrorsCount": 0,
  "lexGramIssues": [],
  "spellingPunctuationErrorsCount": 0,
  "spellingPunctuationIssues": [],
  "feedback": {
    "strengths": "",
    "improvements": ""
  }
}

-------------------------------------
STUDENT ANSWER:
{{student_answer}}`,
LETTER_CHECK_VARIANT_11: `You are an official EGE English writing examiner for Task 37. Evaluate the student's email strictly according to the official 2026 criteria. Be accurate, conservative, and do not invent content that is not present in the student's answer.

TASK:
You have received an email message from your English-speaking pen-friend Patrick:
From: Patrick@mail.uk
To: Russian_friend@ege.ru
Subject: A lesson to remember

... At school we talked about the events in the history of our country that we can be proud of. What is the event in the history of Russia that you are most proud of? What historical person do you think best represents the values of your country? Why is it important to know the history of your country? During the holidays my friends and I always help our local environment protection organizations ...

Write an email to Patrick.
In your message:
– answer his questions;
– ask 3 questions about the local environment protection organizations.

Write 100–140 words.
Remember the rules of email writing.

-------------------------------------
WORD COUNT RULES (STRICT):
1. Count all words in the student's answer.
2. If the answer contains fewer than 90 words, give 0 points for ALL criteria.
3. If the answer contains more than 154 words, the response is still accepted for assessment, but evaluate ONLY the first 140 words. Ignore everything after the 140th word.
4. Always report:
   - total word count,
   - length status: underlength / acceptable / overlength,
   - whether truncation was applied.

-------------------------------------
K1 — COMMUNICATIVE TASK ACHIEVEMENT / CONTENT (max 2)

Check ALL 6 aspects:

1. The student answers what event in the history of Russia they are most proud of.
2. The student answers what historical person best represents the values of their country.
3. The student answers why it is important to know the history of their country.
4. The student asks 3 questions about the local environment protection organizations.
5. Politeness conventions are observed:
   - thanks for the received email and/or positive reaction to receiving it,
   - hope for further contact.
6. Informal style is correct:
   - greeting,
   - closing phrase,
   - signature,
   all appropriate for an informal email.

SCORING FOR K1:
2 points if:
The task is completed fully:
- all aspects are covered,
- full and accurate answers are given to all questions,
- 3 correct questions are asked on the required topic,
- the style is appropriate,
- politeness conventions are observed.
1 incomplete or slightly inaccurate aspect is allowed.

1 point if:
The task is completed, but not fully:
- all cases not falling under 2 points or 0 points.

0 points if:
- 3 or more content aspects are missing,
OR
- all 6 aspects are incomplete/inaccurate,
OR
- 1 aspect is missing and 4–5 aspects are incomplete/inaccurate,
OR
- 2 aspects are missing and 2–4 aspects are incomplete/inaccurate,
OR
- the answer does not meet the required word count because it is under 90 words.

IMPORTANT:
If K1 = 0, then K2 = 0 and K3 = 0 automatically, and the total score = 0.

-------------------------------------
K2 — ORGANIZATION (max 2)

Evaluate ONLY the following organizational features:
- logic of presentation,
- paragraphing,
- correct use of linking devices,
- greeting on a separate line,
- closing phrase on a separate line,
- signature on a separate line,
- overall structural formatting typical of an informal email in English.

IMPORTANT INSTRUCTION FOR K2:
First identify all organization errors.
Then count them.
Then assign the K2 score strictly according to the thresholds below.
Do not assign K2 before counting the errors.

Count as organization errors only problems related to:
- logic,
- paragraphing,
- linking,
- structural formatting of the email,
- irrelevant filler,
- meaningless repetition,
- off-topic or non-communicative fragments that disrupt coherence.

IMPORTANT:
Repeated words, repeated short sentences, filler phrases, or meaningless fragments (for example, repeating the same word or sentence many times without communicative purpose) MUST be treated as organization errors if they damage the logic, coherence, or communicative quality of the text.

Do not ignore such filler even if the rest of the email is otherwise strong.
If filler or repetition clearly disrupts coherence, it must lower K2.

SCORING FOR K2:
2 points if:
- the text is logical,
- linking devices are used correctly,
- the text is correctly divided into paragraphs,
- the structural formatting corresponds to accepted norms of informal email writing,
- and there are no more than 1 organization error.

IMPORTANT:
If the text contains noticeable irrelevant filler, meaningless repetition, or inserted non-communicative fragments that clearly weaken coherence, K2 cannot be 2 unless the disruption is truly minimal.

1 point if:
- there are 2–3 organization errors.

0 points if:
- there are 4 or more organization errors.

For K2, return:
- organizationErrorsCount
- organizationIssues (a short list of specific issues found)

Examples of valid organization issues:
- no paragraphing
- weak or missing linking device
- greeting not on separate line
- closing phrase not on separate line
- signature not on separate line
- illogical order of ideas
- excessive irrelevant repetition
- meaningless filler inserted into the body of the email
- repeated words or sentences with no communicative purpose

-------------------------------------
K3 — LANGUAGE (max 2)

Evaluate:
- vocabulary,
- grammar,
- spelling,
- punctuation,
with respect to the required basic level of difficulty for Task 37.

IMPORTANT INSTRUCTION FOR K3:
First identify language errors.
Then separate them into two groups:
1. lexical/grammar errors
2. spelling/punctuation errors

Then count both groups separately.
Then assign the K3 score strictly according to the thresholds below.
Do not assign K3 before counting the errors.

IMPORTANT:
Do NOT count meaningless repetition, filler, or irrelevant repeated words as language errors unless they also contain a real grammar, lexical, spelling, or punctuation mistake.
Such issues should normally affect K2, not K3.

SCORING FOR K3:
2 points if:
- the vocabulary and grammar correspond to the required level,
- spelling and punctuation errors are almost absent,
- allowed:
  1–2 lexical/grammar errors AND/OR
  1–2 spelling/punctuation errors.

1 point if:
- the vocabulary and grammar do not fully correspond to the required level,
- there are 3–4 lexical/grammar errors
  AND/OR
- there are 3–4 spelling/punctuation errors.

0 points if:
- the vocabulary and grammar do not correspond to the required level,
- there are 5 or more lexical/grammar errors
  AND/OR
- there are 5 or more spelling/punctuation errors.

For K3, return:
- lexGramErrorsCount
- lexGramIssues (a short list of representative examples)
- spellingPunctuationErrorsCount
- spellingPunctuationIssues (a short list of representative examples)

IMPORTANT FOR K3:
- Count only real errors.
- Do not invent errors.
- Do not punish acceptable minor variation if it is grammatically and communicatively valid.
- Keep the examples short.

-------------------------------------
FINAL SCORING LOGIC:
1. Apply the word count rule first.
2. If the answer is under 90 words, all scores must be 0.
3. If the answer is over 154 words, evaluate only the first 140 words.
4. Evaluate K1.
5. If K1 = 0, then K2 = 0 and K3 = 0 automatically.
6. Otherwise evaluate K2 and K3 strictly by the counted errors and thresholds above.
7. If the text contains obvious irrelevant filler, meaningless repetition, or non-communicative inserted fragments that weaken coherence, this must be reflected in K2.

-------------------------------------
LANGUAGE OF THE OUTPUT:
- All explanatory text for the student must be in Russian.
- Write all comments in Russian.
- Write "feedback.strengths" in Russian.
- Write "feedback.improvements" in Russian.
- Write all items in "organizationIssues" in Russian.
- Write all items in "lexGramIssues" in Russian.
- Write all items in "spellingPunctuationIssues" in Russian.
- Write all "comment" fields inside "aspects" in Russian.
- Keep JSON keys in English exactly as requested.
- Keep aspect names in English exactly as requested.

-------------------------------------
RETURN VALID JSON ONLY:

{
  "wordCount": 0,
  "lengthStatus": "underlength | acceptable | overlength",
  "truncatedTo140": false,
  "scores": {
    "content": 0,
    "organization": 0,
    "language": 0
  },
  "maxScores": {
    "content": 2,
    "organization": 2,
    "language": 2
  },
  "total": 0,
  "maxTotal": 6,
  "aspects": [
    {
      "aspect": "Most important historical event in Russia",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Historical person representing country values",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Why knowing history is important",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "3 questions about environment protection organizations",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Politeness",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Informal style",
      "status": "done | partial | missing",
      "comment": ""
    }
  ],
  "organizationErrorsCount": 0,
  "organizationIssues": [],
  "lexGramErrorsCount": 0,
  "lexGramIssues": [],
  "spellingPunctuationErrorsCount": 0,
  "spellingPunctuationIssues": [],
  "feedback": {
    "strengths": "",
    "improvements": ""
  }
}

-------------------------------------
STUDENT ANSWER:
{{student_answer}}`,
LETTER_CHECK_VARIANT_12: `You are an official EGE English writing examiner for Task 37. Evaluate the student's email strictly according to the official 2026 criteria. Be accurate, conservative, and do not invent content that is not present in the student's answer.

TASK:
You have received an email message from your English-speaking pen-friend Kevin:
From: Kevin@mail.uk
To: Russian_friend@ege.ru
Subject: Reading preferences

... Last week I went to a book festival. It was fantastic! We spent two hours looking through new books and talking to authors. What is the last book you’ve read? What books do you have to read for your literature classes? How often do you spend time reading a book for pleasure? I saw an interesting film in Spanish last week ...

Write an email to Kevin.
In your message:
– answer his questions;
– ask 3 questions about the film.

Write 100–140 words.
Remember the rules of email writing.

-------------------------------------
WORD COUNT RULES (STRICT):
1. Count all words in the student's answer.
2. If the answer contains fewer than 90 words, give 0 points for ALL criteria.
3. If the answer contains more than 154 words, the response is still accepted for assessment, but evaluate ONLY the first 140 words. Ignore everything after the 140th word.
4. Always report:
   - total word count,
   - length status: underlength / acceptable / overlength,
   - whether truncation was applied.

-------------------------------------
K1 — COMMUNICATIVE TASK ACHIEVEMENT / CONTENT (max 2)

Check ALL 6 aspects:

1. The student answers what the last book they have read is.
2. The student answers what books they have to read for their literature classes.
3. The student answers how often they read a book for pleasure.
4. The student asks 3 questions about the film.
5. Politeness conventions are observed:
   - thanks for the received email and/or positive reaction to receiving it,
   - hope for further contact.
6. Informal style is correct:
   - greeting,
   - closing phrase,
   - signature,
   all appropriate for an informal email.

SCORING FOR K1:
2 points if:
The task is completed fully:
- all aspects are covered,
- full and accurate answers are given to all questions,
- 3 correct questions are asked on the required topic,
- the style is appropriate,
- politeness conventions are observed.
1 incomplete or slightly inaccurate aspect is allowed.

1 point if:
The task is completed, but not fully:
- all cases not falling under 2 points or 0 points.

0 points if:
- 3 or more content aspects are missing,
OR
- all 6 aspects are incomplete/inaccurate,
OR
- 1 aspect is missing and 4–5 aspects are incomplete/inaccurate,
OR
- 2 aspects are missing and 2–4 aspects are incomplete/inaccurate,
OR
- the answer does not meet the required word count because it is under 90 words.

IMPORTANT:
If K1 = 0, then K2 = 0 and K3 = 0 automatically, and the total score = 0.

-------------------------------------
K2 — ORGANIZATION (max 2)

Evaluate ONLY the following organizational features:
- logic of presentation,
- paragraphing,
- correct use of linking devices,
- greeting on a separate line,
- closing phrase on a separate line,
- signature on a separate line,
- overall structural formatting typical of an informal email in English.

IMPORTANT INSTRUCTION FOR K2:
First identify all organization errors.
Then count them.
Then assign the K2 score strictly according to the thresholds below.
Do not assign K2 before counting the errors.

Count as organization errors only problems related to:
- logic,
- paragraphing,
- linking,
- structural formatting of the email,
- irrelevant filler,
- meaningless repetition,
- off-topic or non-communicative fragments that disrupt coherence.

IMPORTANT:
Repeated words, repeated short sentences, filler phrases, or meaningless fragments (for example, repeating the same word or sentence many times without communicative purpose) MUST be treated as organization errors if they damage the logic, coherence, or communicative quality of the text.

Do not ignore such filler even if the rest of the email is otherwise strong.
If filler or repetition clearly disrupts coherence, it must lower K2.

SCORING FOR K2:
2 points if:
- the text is logical,
- linking devices are used correctly,
- the text is correctly divided into paragraphs,
- the structural formatting corresponds to accepted norms of informal email writing,
- and there are no more than 1 organization error.

IMPORTANT:
If the text contains noticeable irrelevant filler, meaningless repetition, or inserted non-communicative fragments that clearly weaken coherence, K2 cannot be 2 unless the disruption is truly minimal.

1 point if:
- there are 2–3 organization errors.

0 points if:
- there are 4 or more organization errors.

For K2, return:
- organizationErrorsCount
- organizationIssues (a short list of specific issues found)

Examples of valid organization issues:
- no paragraphing
- weak or missing linking device
- greeting not on separate line
- closing phrase not on separate line
- signature not on separate line
- illogical order of ideas
- excessive irrelevant repetition
- meaningless filler inserted into the body of the email
- repeated words or sentences with no communicative purpose

-------------------------------------
K3 — LANGUAGE (max 2)

Evaluate:
- vocabulary,
- grammar,
- spelling,
- punctuation,
with respect to the required basic level of difficulty for Task 37.

IMPORTANT INSTRUCTION FOR K3:
First identify language errors.
Then separate them into two groups:
1. lexical/grammar errors
2. spelling/punctuation errors

Then count both groups separately.
Then assign the K3 score strictly according to the thresholds below.
Do not assign K3 before counting the errors.

IMPORTANT:
Do NOT count meaningless repetition, filler, or irrelevant repeated words as language errors unless they also contain a real grammar, lexical, spelling, or punctuation mistake.
Such issues should normally affect K2, not K3.

SCORING FOR K3:
2 points if:
- the vocabulary and grammar correspond to the required level,
- spelling and punctuation errors are almost absent,
- allowed:
  1–2 lexical/grammar errors AND/OR
  1–2 spelling/punctuation errors.

1 point if:
- the vocabulary and grammar do not fully correspond to the required level,
- there are 3–4 lexical/grammar errors
  AND/OR
- there are 3–4 spelling/punctuation errors.

0 points if:
- the vocabulary and grammar do not correspond to the required level,
- there are 5 or more lexical/grammar errors
  AND/OR
- there are 5 or more spelling/punctuation errors.

For K3, return:
- lexGramErrorsCount
- lexGramIssues (a short list of representative examples)
- spellingPunctuationErrorsCount
- spellingPunctuationIssues (a short list of representative examples)

IMPORTANT FOR K3:
- Count only real errors.
- Do not invent errors.
- Do not punish acceptable minor variation if it is grammatically and communicatively valid.
- Keep the examples short.

-------------------------------------
FINAL SCORING LOGIC:
1. Apply the word count rule first.
2. If the answer is under 90 words, all scores must be 0.
3. If the answer is over 154 words, evaluate only the first 140 words.
4. Evaluate K1.
5. If K1 = 0, then K2 = 0 and K3 = 0 automatically.
6. Otherwise evaluate K2 and K3 strictly by the counted errors and thresholds above.
7. If the text contains obvious irrelevant filler, meaningless repetition, or non-communicative inserted fragments that weaken coherence, this must be reflected in K2.

-------------------------------------
LANGUAGE OF THE OUTPUT:
- All explanatory text for the student must be in Russian.
- Write all comments in Russian.
- Write "feedback.strengths" in Russian.
- Write "feedback.improvements" in Russian.
- Write all items in "organizationIssues" in Russian.
- Write all items in "lexGramIssues" in Russian.
- Write all items in "spellingPunctuationIssues" in Russian.
- Write all "comment" fields inside "aspects" in Russian.
- Keep JSON keys in English exactly as requested.
- Keep aspect names in English exactly as requested.

-------------------------------------
RETURN VALID JSON ONLY:

{
  "wordCount": 0,
  "lengthStatus": "underlength | acceptable | overlength",
  "truncatedTo140": false,
  "scores": {
    "content": 0,
    "organization": 0,
    "language": 0
  },
  "maxScores": {
    "content": 2,
    "organization": 2,
    "language": 2
  },
  "total": 0,
  "maxTotal": 6,
  "aspects": [
    {
      "aspect": "Last book read",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Books for literature classes",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Reading for pleasure frequency",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "3 questions about the film",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Politeness",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Informal style",
      "status": "done | partial | missing",
      "comment": ""
    }
  ],
  "organizationErrorsCount": 0,
  "organizationIssues": [],
  "lexGramErrorsCount": 0,
  "lexGramIssues": [],
  "spellingPunctuationErrorsCount": 0,
  "spellingPunctuationIssues": [],
  "feedback": {
    "strengths": "",
    "improvements": ""
  }
}

-------------------------------------
STUDENT ANSWER:
{{student_answer}}`,
LETTER_CHECK_VARIANT_13: `You are an official EGE English writing examiner for Task 37. Evaluate the student's email strictly according to the official 2026 criteria. Be accurate, conservative, and do not invent content that is not present in the student's answer.

TASK:
You have received an email message from your English-speaking pen-friend Marion:
From: Marion@mail.uk
To: Russian_friend@ege.ru
Subject: Foreign languages

...They say that Russian students can choose a foreign language to study at school. Do many students choose other languages instead of English? Why do you think they do so? Why have you chosen English?... I’ve just finished reading a collection of Anton Chekhov’s short stories...

Write an email to Marion.
In your message:
– answer her questions;
– ask 3 questions about the book she has just finished reading.

Write 100–140 words.
Remember the rules of email writing.

-------------------------------------
WORD COUNT RULES (STRICT):
1. Count all words in the student's answer.
2. If the answer contains fewer than 90 words, give 0 points for ALL criteria.
3. If the answer contains more than 154 words, the response is still accepted for assessment, but evaluate ONLY the first 140 words. Ignore everything after the 140th word.
4. Always report:
   - total word count,
   - length status: underlength / acceptable / overlength,
   - whether truncation was applied.

-------------------------------------
K1 — COMMUNICATIVE TASK ACHIEVEMENT / CONTENT (max 2)

Check ALL 6 aspects:

1. The student answers whether many students choose other foreign languages instead of English.
2. The student answers why they think students choose other foreign languages instead of English.
3. The student answers why they have chosen English.
4. The student asks 3 questions about the collection of Anton Chekhov’s short stories.
5. Politeness conventions are observed:
   - thanks for the received email and/or positive reaction to receiving it,
   - hope for further contact.
6. Informal style is correct:
   - greeting,
   - closing phrase,
   - signature,
   all appropriate for an informal email.

SCORING FOR K1:
2 points if:
The task is completed fully:
- all aspects are covered,
- full and accurate answers are given to all questions,
- 3 correct questions are asked on the required topic,
- the style is appropriate,
- politeness conventions are observed.
1 incomplete or slightly inaccurate aspect is allowed.

1 point if:
The task is completed, but not fully:
- all cases not falling under 2 points or 0 points.

0 points if:
- 3 or more content aspects are missing,
OR
- all 6 aspects are incomplete/inaccurate,
OR
- 1 aspect is missing and 4–5 aspects are incomplete/inaccurate,
OR
- 2 aspects are missing and 2–4 aspects are incomplete/inaccurate,
OR
- the answer does not meet the required word count because it is under 90 words.

IMPORTANT:
If K1 = 0, then K2 = 0 and K3 = 0 automatically, and the total score = 0.

-------------------------------------
K2 — ORGANIZATION (max 2)

Evaluate ONLY the following organizational features:
- logic of presentation,
- paragraphing,
- correct use of linking devices,
- greeting on a separate line,
- closing phrase on a separate line,
- signature on a separate line,
- overall structural formatting typical of an informal email in English.

IMPORTANT INSTRUCTION FOR K2:
First identify all organization errors.
Then count them.
Then assign the K2 score strictly according to the thresholds below.
Do not assign K2 before counting the errors.

Count as organization errors only problems related to:
- logic,
- paragraphing,
- linking,
- structural formatting of the email,
- irrelevant filler,
- meaningless repetition,
- off-topic or non-communicative fragments that disrupt coherence.

IMPORTANT:
Repeated words, repeated short sentences, filler phrases, or meaningless fragments (for example, repeating the same word or sentence many times without communicative purpose) MUST be treated as organization errors if they damage the logic, coherence, or communicative quality of the text.

Do not ignore such filler even if the rest of the email is otherwise strong.
If filler or repetition clearly disrupts coherence, it must lower K2.

SCORING FOR K2:
2 points if:
- the text is logical,
- linking devices are used correctly,
- the text is correctly divided into paragraphs,
- the structural formatting corresponds to accepted norms of informal email writing,
- and there are no more than 1 organization error.

IMPORTANT:
If the text contains noticeable irrelevant filler, meaningless repetition, or inserted non-communicative fragments that clearly weaken coherence, K2 cannot be 2 unless the disruption is truly minimal.

1 point if:
- there are 2–3 organization errors.

0 points if:
- there are 4 or more organization errors.

For K2, return:
- organizationErrorsCount
- organizationIssues (a short list of specific issues found)

Examples of valid organization issues:
- no paragraphing
- weak or missing linking device
- greeting not on separate line
- closing phrase not on separate line
- signature not on separate line
- illogical order of ideas
- excessive irrelevant repetition
- meaningless filler inserted into the body of the email
- repeated words or sentences with no communicative purpose

-------------------------------------
K3 — LANGUAGE (max 2)

Evaluate:
- vocabulary,
- grammar,
- spelling,
- punctuation,
with respect to the required basic level of difficulty for Task 37.

IMPORTANT INSTRUCTION FOR K3:
First identify language errors.
Then separate them into two groups:
1. lexical/grammar errors
2. spelling/punctuation errors

Then count both groups separately.
Then assign the K3 score strictly according to the thresholds below.
Do not assign K3 before counting the errors.

IMPORTANT:
Do NOT count meaningless repetition, filler, or irrelevant repeated words as language errors unless they also contain a real grammar, lexical, spelling, or punctuation mistake.
Such issues should normally affect K2, not K3.

SCORING FOR K3:
2 points if:
- the vocabulary and grammar correspond to the required level,
- spelling and punctuation errors are almost absent,
- allowed:
  1–2 lexical/grammar errors AND/OR
  1–2 spelling/punctuation errors.

1 point if:
- the vocabulary and grammar do not fully correspond to the required level,
- there are 3–4 lexical/grammar errors
  AND/OR
- there are 3–4 spelling/punctuation errors.

0 points if:
- the vocabulary and grammar do not correspond to the required level,
- there are 5 or more lexical/grammar errors
  AND/OR
- there are 5 or more spelling/punctuation errors.

For K3, return:
- lexGramErrorsCount
- lexGramIssues (a short list of representative examples)
- spellingPunctuationErrorsCount
- spellingPunctuationIssues (a short list of representative examples)

IMPORTANT FOR K3:
- Count only real errors.
- Do not invent errors.
- Do not punish acceptable minor variation if it is grammatically and communicatively valid.
- Keep the examples short.

-------------------------------------
FINAL SCORING LOGIC:
1. Apply the word count rule first.
2. If the answer is under 90 words, all scores must be 0.
3. If the answer is over 154 words, evaluate only the first 140 words.
4. Evaluate K1.
5. If K1 = 0, then K2 = 0 and K3 = 0 automatically.
6. Otherwise evaluate K2 and K3 strictly by the counted errors and thresholds above.
7. If the text contains obvious irrelevant filler, meaningless repetition, or non-communicative inserted fragments that weaken coherence, this must be reflected in K2.

-------------------------------------
LANGUAGE OF THE OUTPUT:
- All explanatory text for the student must be in Russian.
- Write all comments in Russian.
- Write "feedback.strengths" in Russian.
- Write "feedback.improvements" in Russian.
- Write all items in "organizationIssues" in Russian.
- Write all items in "lexGramIssues" in Russian.
- Write all items in "spellingPunctuationIssues" in Russian.
- Write all "comment" fields inside "aspects" in Russian.
- Keep JSON keys in English exactly as requested.
- Keep aspect names in English exactly as requested.

-------------------------------------
RETURN VALID JSON ONLY:

{
  "wordCount": 0,
  "lengthStatus": "underlength | acceptable | overlength",
  "truncatedTo140": false,
  "scores": {
    "content": 0,
    "organization": 0,
    "language": 0
  },
  "maxScores": {
    "content": 2,
    "organization": 2,
    "language": 2
  },
  "total": 0,
  "maxTotal": 6,
  "aspects": [
    {
      "aspect": "Do students choose other foreign languages",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Why students choose other foreign languages",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Why student has chosen English",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "3 questions about Chekhov short stories collection",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Politeness",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Informal style",
      "status": "done | partial | missing",
      "comment": ""
    }
  ],
  "organizationErrorsCount": 0,
  "organizationIssues": [],
  "lexGramErrorsCount": 0,
  "lexGramIssues": [],
  "spellingPunctuationErrorsCount": 0,
  "spellingPunctuationIssues": [],
  "feedback": {
    "strengths": "",
    "improvements": ""
  }
}

-------------------------------------
STUDENT ANSWER:
{{student_answer}}`,
LETTER_CHECK_VARIANT_14: `You are an official EGE English writing examiner for Task 37. Evaluate the student's email strictly according to the official 2026 criteria. Be accurate, conservative, and do not invent content that is not present in the student's answer.

TASK:
You have received an email message from your English-speaking pen-friend Simon:
From: Simon@mail.uk
To: Russian_friend@ege.ru
Subject: Computer games

...I know that the Russian team won The International 10 – world cyber sport championship in 2021. What computer games are most popular with Russian teenagers? How much time do you and your friends spend playing computer games? What else do you use your computer for? I spend too much time surfing the internet and I’m thinking of joining our school sports club...

Write an email to Simon.
In your message:
– answer his questions;
– ask 3 questions about his school sports club.

Write 100–140 words.
Remember the rules of email writing.

-------------------------------------
WORD COUNT RULES (STRICT):
1. Count all words in the student's answer.
2. If the answer contains fewer than 90 words, give 0 points for ALL criteria.
3. If the answer contains more than 154 words, the response is still accepted for assessment, but evaluate ONLY the first 140 words. Ignore everything after the 140th word.
4. Always report:
   - total word count,
   - length status: underlength / acceptable / overlength,
   - whether truncation was applied.

-------------------------------------
K1 — COMMUNICATIVE TASK ACHIEVEMENT / CONTENT (max 2)

Check ALL 6 aspects:

1. The student answers what computer games are most popular with Russian teenagers.
2. The student answers how much time they and their friends spend playing computer games.
3. The student answers what else they use their computer for.
4. The student asks 3 questions about Simon’s school sports club.
5. Politeness conventions are observed:
   - thanks for the received email and/or positive reaction to receiving it,
   - hope for further contact.
6. Informal style is correct:
   - greeting,
   - closing phrase,
   - signature,
   all appropriate for an informal email.

SCORING FOR K1:
2 points if:
The task is completed fully:
- all aspects are covered,
- full and accurate answers are given to all questions,
- 3 correct questions are asked on the required topic,
- the style is appropriate,
- politeness conventions are observed.
1 incomplete or slightly inaccurate aspect is allowed.

1 point if:
The task is completed, but not fully:
- all cases not falling under 2 points or 0 points.

0 points if:
- 3 or more content aspects are missing,
OR
- all 6 aspects are incomplete/inaccurate,
OR
- 1 aspect is missing and 4–5 aspects are incomplete/inaccurate,
OR
- 2 aspects are missing and 2–4 aspects are incomplete/inaccurate,
OR
- the answer does not meet the required word count because it is under 90 words.

IMPORTANT:
If K1 = 0, then K2 = 0 and K3 = 0 automatically, and the total score = 0.

-------------------------------------
K2 — ORGANIZATION (max 2)

Evaluate ONLY the following organizational features:
- logic of presentation,
- paragraphing,
- correct use of linking devices,
- greeting on a separate line,
- closing phrase on a separate line,
- signature on a separate line,
- overall structural formatting typical of an informal email in English.

IMPORTANT INSTRUCTION FOR K2:
First identify all organization errors.
Then count them.
Then assign the K2 score strictly according to the thresholds below.
Do not assign K2 before counting the errors.

Count as organization errors only problems related to:
- logic,
- paragraphing,
- linking,
- structural formatting of the email,
- irrelevant filler,
- meaningless repetition,
- off-topic or non-communicative fragments that disrupt coherence.

IMPORTANT:
Repeated words, repeated short sentences, filler phrases, or meaningless fragments (for example, repeating the same word or sentence many times without communicative purpose) MUST be treated as organization errors if they damage the logic, coherence, or communicative quality of the text.

Do not ignore such filler even if the rest of the email is otherwise strong.
If filler or repetition clearly disrupts coherence, it must lower K2.

SCORING FOR K2:
2 points if:
- the text is logical,
- linking devices are used correctly,
- the text is correctly divided into paragraphs,
- the structural formatting corresponds to accepted norms of informal email writing,
- and there are no more than 1 organization error.

IMPORTANT:
If the text contains noticeable irrelevant filler, meaningless repetition, or inserted non-communicative fragments that clearly weaken coherence, K2 cannot be 2 unless the disruption is truly minimal.

1 point if:
- there are 2–3 organization errors.

0 points if:
- there are 4 or more organization errors.

For K2, return:
- organizationErrorsCount
- organizationIssues (a short list of specific issues found)

Examples of valid organization issues:
- no paragraphing
- weak or missing linking device
- greeting not on separate line
- closing phrase not on separate line
- signature not on separate line
- illogical order of ideas
- excessive irrelevant repetition
- meaningless filler inserted into the body of the email
- repeated words or sentences with no communicative purpose

-------------------------------------
K3 — LANGUAGE (max 2)

Evaluate:
- vocabulary,
- grammar,
- spelling,
- punctuation,
with respect to the required basic level of difficulty for Task 37.

IMPORTANT INSTRUCTION FOR K3:
First identify language errors.
Then separate them into two groups:
1. lexical/grammar errors
2. spelling/punctuation errors

Then count both groups separately.
Then assign the K3 score strictly according to the thresholds below.
Do not assign K3 before counting the errors.

IMPORTANT:
Do NOT count meaningless repetition, filler, or irrelevant repeated words as language errors unless they also contain a real grammar, lexical, spelling, or punctuation mistake.
Such issues should normally affect K2, not K3.

SCORING FOR K3:
2 points if:
- the vocabulary and grammar correspond to the required level,
- spelling and punctuation errors are almost absent,
- allowed:
  1–2 lexical/grammar errors AND/OR
  1–2 spelling/punctuation errors.

1 point if:
- the vocabulary and grammar do not fully correspond to the required level,
- there are 3–4 lexical/grammar errors
  AND/OR
- there are 3–4 spelling/punctuation errors.

0 points if:
- the vocabulary and grammar do not correspond to the required level,
- there are 5 or more lexical/grammar errors
  AND/OR
- there are 5 or more spelling/punctuation errors.

For K3, return:
- lexGramErrorsCount
- lexGramIssues (a short list of representative examples)
- spellingPunctuationErrorsCount
- spellingPunctuationIssues (a short list of representative examples)

IMPORTANT FOR K3:
- Count only real errors.
- Do not invent errors.
- Do not punish acceptable minor variation if it is grammatically and communicatively valid.
- Keep the examples short.

-------------------------------------
FINAL SCORING LOGIC:
1. Apply the word count rule first.
2. If the answer is under 90 words, all scores must be 0.
3. If the answer is over 154 words, evaluate only the first 140 words.
4. Evaluate K1.
5. If K1 = 0, then K2 = 0 and K3 = 0 automatically.
6. Otherwise evaluate K2 and K3 strictly by the counted errors and thresholds above.
7. If the text contains obvious irrelevant filler, meaningless repetition, or non-communicative inserted fragments that weaken coherence, this must be reflected in K2.

-------------------------------------
LANGUAGE OF THE OUTPUT:
- All explanatory text for the student must be in Russian.
- Write all comments in Russian.
- Write "feedback.strengths" in Russian.
- Write "feedback.improvements" in Russian.
- Write all items in "organizationIssues" in Russian.
- Write all items in "lexGramIssues" in Russian.
- Write all items in "spellingPunctuationIssues" in Russian.
- Write all "comment" fields inside "aspects" in Russian.
- Keep JSON keys in English exactly as requested.
- Keep aspect names in English exactly as requested.

-------------------------------------
RETURN VALID JSON ONLY:

{
  "wordCount": 0,
  "lengthStatus": "underlength | acceptable | overlength",
  "truncatedTo140": false,
  "scores": {
    "content": 0,
    "organization": 0,
    "language": 0
  },
  "maxScores": {
    "content": 2,
    "organization": 2,
    "language": 2
  },
  "total": 0,
  "maxTotal": 6,
  "aspects": [
    {
      "aspect": "Popular computer games among Russian teenagers",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Time spent playing computer games",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Other computer uses",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "3 questions about school sports club",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Politeness",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Informal style",
      "status": "done | partial | missing",
      "comment": ""
    }
  ],
  "organizationErrorsCount": 0,
  "organizationIssues": [],
  "lexGramErrorsCount": 0,
  "lexGramIssues": [],
  "spellingPunctuationErrorsCount": 0,
  "spellingPunctuationIssues": [],
  "feedback": {
    "strengths": "",
    "improvements": ""
  }
}

-------------------------------------
STUDENT ANSWER:
{{student_answer}}`,
LETTER_CHECK_VARIANT_15: `You are an official EGE English writing examiner for Task 37. Evaluate the student's email strictly according to the official 2026 criteria. Be accurate, conservative, and do not invent content that is not present in the student's answer.

TASK:
You have received an email message from your English-speaking pen-friend Sandra:
From: Sandra@mail.uk
To: Russian_friend@ege.ru
Subject: Food preferences

... Nowadays I always try to eat healthy food. But in the past, I used to love sweets and fast food very much. What kind of food do Russian people eat most often? How have your food preferences changed since you were a kid? Do you think your food preferences will continue to change as you get older, why or why not? My family and I still write letters to Santa at Christmas ...

Write an email to Sandra.
In your message:
– answer her questions;
– ask 3 questions about her letters to Santa.

Write 100–140 words.
Remember the rules of email writing.

-------------------------------------
WORD COUNT RULES (STRICT):
1. Count all words in the student's answer.
2. If the answer contains fewer than 90 words, give 0 points for ALL criteria.
3. If the answer contains more than 154 words, the response is still accepted for assessment, but evaluate ONLY the first 140 words. Ignore everything after the 140th word.
4. Always report:
   - total word count,
   - length status: underlength / acceptable / overlength,
   - whether truncation was applied.

-------------------------------------
K1 — COMMUNICATIVE TASK ACHIEVEMENT / CONTENT (max 2)

Check ALL 6 aspects:

1. The student answers what kind of food Russian people eat most often.
2. The student answers how their food preferences have changed since childhood.
3. The student answers whether they think their food preferences will continue to change as they get older and explains why / why not.
4. The student asks 3 questions about Sandra’s letters to Santa.
5. Politeness conventions are observed:
   - thanks for the received email and/or positive reaction to receiving it,
   - hope for further contact.
6. Informal style is correct:
   - greeting,
   - closing phrase,
   - signature,
   all appropriate for an informal email.

SCORING FOR K1:
2 points if:
The task is completed fully:
- all aspects are covered,
- full and accurate answers are given to all questions,
- 3 correct questions are asked on the required topic,
- the style is appropriate,
- politeness conventions are observed.
1 incomplete or slightly inaccurate aspect is allowed.

1 point if:
The task is completed, but not fully:
- all cases not falling under 2 points or 0 points.

0 points if:
- 3 or more content aspects are missing,
OR
- all 6 aspects are incomplete/inaccurate,
OR
- 1 aspect is missing and 4–5 aspects are incomplete/inaccurate,
OR
- 2 aspects are missing and 2–4 aspects are incomplete/inaccurate,
OR
- the answer does not meet the required word count because it is under 90 words.

IMPORTANT:
If K1 = 0, then K2 = 0 and K3 = 0 automatically, and the total score = 0.

-------------------------------------
K2 — ORGANIZATION (max 2)

Evaluate ONLY the following organizational features:
- logic of presentation,
- paragraphing,
- correct use of linking devices,
- greeting on a separate line,
- closing phrase on a separate line,
- signature on a separate line,
- overall structural formatting typical of an informal email in English.

IMPORTANT INSTRUCTION FOR K2:
First identify all organization errors.
Then count them.
Then assign the K2 score strictly according to the thresholds below.
Do not assign K2 before counting the errors.

Count as organization errors only problems related to:
- logic,
- paragraphing,
- linking,
- structural formatting of the email,
- irrelevant filler,
- meaningless repetition,
- off-topic or non-communicative fragments that disrupt coherence.

IMPORTANT:
Repeated words, repeated short sentences, filler phrases, or meaningless fragments (for example, repeating the same word or sentence many times without communicative purpose) MUST be treated as organization errors if they damage the logic, coherence, or communicative quality of the text.

Do not ignore such filler even if the rest of the email is otherwise strong.
If filler or repetition clearly disrupts coherence, it must lower K2.

SCORING FOR K2:
2 points if:
- the text is logical,
- linking devices are used correctly,
- the text is correctly divided into paragraphs,
- the structural formatting corresponds to accepted norms of informal email writing,
- and there are no more than 1 organization error.

IMPORTANT:
If the text contains noticeable irrelevant filler, meaningless repetition, or inserted non-communicative fragments that clearly weaken coherence, K2 cannot be 2 unless the disruption is truly minimal.

1 point if:
- there are 2–3 organization errors.

0 points if:
- there are 4 or more organization errors.

For K2, return:
- organizationErrorsCount
- organizationIssues (a short list of specific issues found)

Examples of valid organization issues:
- no paragraphing
- weak or missing linking device
- greeting not on separate line
- closing phrase not on separate line
- signature not on separate line
- illogical order of ideas
- excessive irrelevant repetition
- meaningless filler inserted into the body of the email
- repeated words or sentences with no communicative purpose

-------------------------------------
K3 — LANGUAGE (max 2)

Evaluate:
- vocabulary,
- grammar,
- spelling,
- punctuation,
with respect to the required basic level of difficulty for Task 37.

IMPORTANT INSTRUCTION FOR K3:
First identify language errors.
Then separate them into two groups:
1. lexical/grammar errors
2. spelling/punctuation errors

Then count both groups separately.
Then assign the K3 score strictly according to the thresholds below.
Do not assign K3 before counting the errors.

IMPORTANT:
Do NOT count meaningless repetition, filler, or irrelevant repeated words as language errors unless they also contain a real grammar, lexical, spelling, or punctuation mistake.
Such issues should normally affect K2, not K3.

SCORING FOR K3:
2 points if:
- the vocabulary and grammar correspond to the required level,
- spelling and punctuation errors are almost absent,
- allowed:
  1–2 lexical/grammar errors AND/OR
  1–2 spelling/punctuation errors.

1 point if:
- the vocabulary and grammar do not fully correspond to the required level,
- there are 3–4 lexical/grammar errors
  AND/OR
- there are 3–4 spelling/punctuation errors.

0 points if:
- the vocabulary and grammar do not correspond to the required level,
- there are 5 or more lexical/grammar errors
  AND/OR
- there are 5 or more spelling/punctuation errors.

For K3, return:
- lexGramErrorsCount
- lexGramIssues (a short list of representative examples)
- spellingPunctuationErrorsCount
- spellingPunctuationIssues (a short list of representative examples)

IMPORTANT FOR K3:
- Count only real errors.
- Do not invent errors.
- Do not punish acceptable minor variation if it is grammatically and communicatively valid.
- Keep the examples short.

-------------------------------------
FINAL SCORING LOGIC:
1. Apply the word count rule first.
2. If the answer is under 90 words, all scores must be 0.
3. If the answer is over 154 words, evaluate only the first 140 words.
4. Evaluate K1.
5. If K1 = 0, then K2 = 0 and K3 = 0 automatically.
6. Otherwise evaluate K2 and K3 strictly by the counted errors and thresholds above.
7. If the text contains obvious irrelevant filler, meaningless repetition, or non-communicative inserted fragments that weaken coherence, this must be reflected in K2.

-------------------------------------
LANGUAGE OF THE OUTPUT:
- All explanatory text for the student must be in Russian.
- Write all comments in Russian.
- Write "feedback.strengths" in Russian.
- Write "feedback.improvements" in Russian.
- Write all items in "organizationIssues" in Russian.
- Write all items in "lexGramIssues" in Russian.
- Write all items in "spellingPunctuationIssues" in Russian.
- Write all "comment" fields inside "aspects" in Russian.
- Keep JSON keys in English exactly as requested.
- Keep aspect names in English exactly as requested.

-------------------------------------
RETURN VALID JSON ONLY:

{
  "wordCount": 0,
  "lengthStatus": "underlength | acceptable | overlength",
  "truncatedTo140": false,
  "scores": {
    "content": 0,
    "organization": 0,
    "language": 0
  },
  "maxScores": {
    "content": 2,
    "organization": 2,
    "language": 2
  },
  "total": 0,
  "maxTotal": 6,
  "aspects": [
    {
      "aspect": "Food Russian people eat most often",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "How food preferences changed since childhood",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Future food preferences change + explanation",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "3 questions about letters to Santa",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Politeness",
      "status": "done | partial | missing",
      "comment": ""
    },
    {
      "aspect": "Informal style",
      "status": "done | partial | missing",
      "comment": ""
    }
  ],
  "organizationErrorsCount": 0,
  "organizationIssues": [],
  "lexGramErrorsCount": 0,
  "lexGramIssues": [],
  "spellingPunctuationErrorsCount": 0,
  "spellingPunctuationIssues": [],
  "feedback": {
    "strengths": "",
    "improvements": ""
  }
}

-------------------------------------
STUDENT ANSWER:
{{student_answer}}`,

};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { prompt, studentText } = body;

    if (!prompt || !studentText) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const basePrompt = PROMPTS[prompt];

    if (!basePrompt) {
      return res.status(400).json({ error: "Unknown prompt key" });
    }

    const finalPrompt = basePrompt.replace("{{student_answer}}", studentText);

    const response = await client.responses.create({
      model: "gpt-5-mini",
      input: [
        {
          role: "system",
          content: "You are a strict EGE English writing examiner."
        },
        {
          role: "user",
          content: finalPrompt
        }
      ]
    });

    return res.status(200).json({ output: response.output_text });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to evaluate writing" });
  }
}