// let searchbar = document.getElementById('search');
// searchbar.focus();
let searchMsg;

function errorclick(i) {
    searchMsg = i;
    console.log("iam inside the helper js file");
    searchAnswers(searchMsg);
}

const copyToClipboard = str => {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};

function renderCopyButtons() {
    document.querySelectorAll('pre > code').forEach(code => {
        code.innerHTML += '<button class="content-220499" onclick="copyToClipboard(this.parentElement.innerHTML.slice(0, this.parentElement.innerHTML.indexOf(\'content-220499\') - 15))">Copy</button>'
    })
}

function createAnswerCard(answers, question) {
    let ans = answers.slice(0, 2);
    let cards = '';
    for (let i in ans) {
        cards += '<div class="shadow card"><div class="question-wrapper"><a target="_blank" href="' + question.link + '"><h2>Q: ' + question.title + '</h2></a>' + question.body + ' <span style="position:absolute;top:5px;left:10px;font-size:20pt;opacity:.1;font-weight:bold;color:#ddd;">' + (Number(i) + 1) + '</span></div><div class="pad-20">' + ans[i].body + '</div></div>';
    }
    return cards;
}
function hideAnswer(el) {
    document.querySelector(".answer-container-" + el.dataset.index).innerHTML = '';
    el.innerHTML = 'View Answer';
    el.onclick = () => viewAnswer(el);
}
function viewAnswer(el) {
    el.innerHTML = 'Loading answer';
    fetch('https://api.stackexchange.com/2.2/questions/' + el.dataset.questionid + '/answers?order=desc&sort=votes&site=stackoverflow&filter=withbody')
        .then(response => response.json())
        .then(data => {
            document.querySelector(".answer-container-" + el.dataset.index).innerHTML = '<h2>Answer:</h2>' + data.items[0].body;
        })
        .then(() => {
            el.innerHTML = 'Hide Answer'
            el.onclick = () => hideAnswer(el);
        })
        .then(renderCopyButtons);
}

function createQuestionsCard(questions) {
    let cards = '<h2>Other Questions</h2>';
    let i = 0;
    for (let question of questions.slice(1)) {
        cards += '<div class="shadow card"><div class="question-wrapper"><a target="_blank" href="' + question.link + '"><h2>' + question.title + '</h2></a>' + question.body + '</div><div class="pad-20"><button data-questionid="' + question.id + '" data-index="' + i + '" class="blue-button" onclick="viewAnswer(this)">View Answer</button><div class="answer-container-' + i + '"></div></div></div>';
        i++;
    }
    return cards;
}

async function searchAnswers(msg) {

    document.querySelector("#answers").innerHTML = '';
    let searchQuery = msg;
    searchQuery = searchQuery.trim().replace(/ /g, '+');
    let data = await fetch('https://api.stackexchange.com/2.2/search/advanced?order=desc&sort=relevance&q=' + searchQuery + '&answers=1&site=stackoverflow&filter=withbody')
    let questions = (await data.json()).items;

    questions = questions.map(question => ({ title: question.title, link: question.link, id: question.question_id, body: question.body }));
    fetch('https://api.stackexchange.com/2.2/questions/' + questions[0].id + '/answers?order=desc&sort=votes&site=stackoverflow&filter=withbody')
        .then(response => response.json())
        .then(data => {
            console.log(data.items);
            document.querySelector("#answers").innerHTML += createAnswerCard(data.items, questions[0]);
        })
        .then(() => {
            document.querySelector("#answers").innerHTML += createQuestionsCard(questions);
        })
        .then(renderCopyButtons);

}


// window.addEventListener('keyup', (e) => {
//     if (e.keyCode === 13) {
//         searchAnswers();
//     }
// }, false);

// document.querySelector('.search-button').addEventListener('click', searchAnswers);