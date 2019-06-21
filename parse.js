const http = require('http');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const dataUrl = 'http://rozklad.kpi.ua/Schedules/ViewSchedule.aspx?g=b41a3ace-d3f0-4b64-9d15-2b7f9a970aa6';
var rawData = '';


function parse(data) {
    const dom = new JSDOM(data);

    const firstWeekElem = dom.window.document.getElementById('ctl00_MainContent_FirstScheduleTable');
    const secondWeekElem = dom.window.document.getElementById('ctl00_MainContent_SecondScheduleTable');

    const firstWeek = parseWeek(firstWeekElem);
    const secondtWeek = parseWeek(secondWeekElem);

    return formatResult(firstWeek,1)+formatResult(secondtWeek,2);
}

function parseWeek(week) {
    const rows = week.getElementsByTagName('tr');
    const resultRows = [];
    for(let i = 1; i<rows.length; i++) 
    {
        const tds = rows[i].getElementsByTagName('td');
        let resultRow = [];
        for(let j = 1; j<tds.length; j++) 
        {
            let lesson = {};
            lesson.number = i;
            if(tds[j].innerHTML == '')
            {
                resultRow.push(lesson);
                continue;
            } else {
                const lessonDetails = tds[j].getElementsByTagName('a');

                lesson.subj = lessonDetails[0].innerHTML;
                if(lessonDetails[1] != undefined)
                {
                    lesson.teacher = lessonDetails[1].innerHTML;
                    lesson.loc = lessonDetails[2].innerHTML;
                }

                resultRow.push(lesson);
            }
        }
        resultRows.push(resultRow);
    }
    return resultRows;
}

function formatResult(data, numWeek) {
    let result = '';
    const weekDays = ['Понеділок',"Вівторок","Середа","Четвер","П'ятниця","Субота"];
    result += '===Week '+numWeek+'===\n';
    for(let i = 0; i < data[0].length; i++)
    {
        result += '--' + weekDays[i] + '--\n';
        for(let j =0; j < data.length; j++)
        {
            if(data[j][i].subj == undefined)
            {
                result += data[j][i].number + '.\n'
            } else {
                result += data[j][i].number + data[j][i].subj + '\n';

                if(data[j][i].teacher != undefined)
                {
                    result += data[j][i].teacher + '\n' + data[j][i].loc +'\n';
                }
            }
        }
    }
    result+='\n';
    return result;
}

var getData = (function(resolve) {
    http.get(dataUrl, (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk)=>{
            rawData+=chunk;
        });
        res.on('end', ()=>{
            resolve(parse(rawData));
        });
    }).on('error', (err)=>{
        console.log('Error', err.message);
    });
}).bind(this);

function getSchedule() {
    return new Promise(resolve=>{
        getData(resolve);
    })
}

module.exports = getSchedule;