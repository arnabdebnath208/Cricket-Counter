var runCount = 0;
var wicketCount = 0;
var overCount = 0;
var ballCount = 0;

var overs=[]
var balls=[]

// Get overs and balls from storage
if(localStorage.getItem('overs'))
    overs = JSON.parse(localStorage.getItem('overs'))
if(localStorage.getItem('balls'))
    balls = JSON.parse(localStorage.getItem('balls'))

function closeOverlay()
{
    document.getElementById('overlay').style.display='none'
}

function addBall(countable,run,wicket,wicketType,type)
{

    if(document.getElementById('ballsUI').innerHTML=='Waiting for first ball...')
        document.getElementById('ballsUI').innerHTML=''

    if(ballCount<6)
    {
        balls.push({
            countable:countable,
            run:run,
            wicket:wicket,
            wicketType:wicketType,
            type:type
        })
        // Here is the process to ballCount,wicketCount,runCount
        runCount+=run
        if(wicket)
            wicketCount+=wicket
        if(countable)
            ballCount++
        document.getElementById('ballsUI').innerHTML+=getBallUI({
            countable:countable,
            run:run,
            wicket:wicket,
            wicketType:wicketType,
            type:type
        })

    }
    else if(ballCount==6)
    {
        overs.push(balls)
        balls=[]
        overCount++
        ballCount=0
        document.getElementById('ballsUI').innerHTML=''
        balls.push({
            countable:countable,
            run:run,
            wicket:wicket,
            wicketType:wicketType,
            type:type
        })
        runCount+=run
        if(wicket)
            wicketCount+=wicket
        if(countable)
            ballCount++
        document.getElementById('ballsUI').innerHTML+=getBallUI({
            countable:countable,
            run:run,
            wicket:wicket,
            wicketType:wicketType,
            type:type
        })
    }

    let displayOverCount = overCount
    let displayBallCount = ballCount

    if(ballCount==6)
    {
        displayOverCount++
        displayBallCount=0
    }
    
    document.getElementById('run').innerHTML = runCount;
    document.getElementById('wicket').innerHTML = wicketCount;
    document.getElementById('over').innerHTML = displayOverCount;
    document.getElementById('ball').innerHTML = displayBallCount;
    document.getElementById('crr').innerHTML = getRunRate('crr');
    document.getElementById('orr').innerHTML = getRunRate('orr');

    storeScore()
}

function undoBall()
{
    if(balls.length>0)
        balls.pop()
    else if(overs.length>0)
    {
        balls = overs.pop()
        balls.pop()
    }
    else
        return;

    if(balls.length==0)
    {
        if(overs.length>0)
        {
            balls = overs.pop()
            overCount--
            ballCount=6
        }
    }

    storeScore()
    refreshUI()
}

function reset(confirm)
{
    if (confirm) {
        // Remove data from storage
        localStorage.removeItem('overs')
        localStorage.removeItem('balls')
        overs=[]
        balls=[]
        refreshUI()
    }
}

function setTarget()
{

}
function scoreboard()
{
    //     <div class="scoreboard">
    //     <h2>Scoreboard</h2>
    //     <table class="scoreboard-table">
    //         <tr>
    //             <td>01</td>
    //             <td class="overScore"><span class="ball fourBall">4</span><span class="ball wideBall">1</span><span class="ball outBall">W</span><span class="ball noBall">1</span><span class="ball sixBall">6</span><span class="ball runBall">3</span><span class="ball dotBall"><div class="dot"></div></span></td>
    //         </tr>
    //         <tr>
    //             <td>01</td>
    //             <td class="overScore"><span class="ball fourBall">4</span><span class="ball wideBall">1</span><span class="ball outBall">W</span><span class="ball noBall">1</span><span class="ball sixBall">6</span><span class="ball runBall">3</span><span class="ball dotBall"><div class="dot"></div></span></td>
    //         </tr>
    //     </table>
    //     <div class="scoreinfo"><h3>Total: <span>24</span></h3><h3>Extra Run: <span>5</span></h3><h3>Wicket: <span>1</span></h3></div>
    // </div>
    let scoreboardUI = '<div class="scoreboard"><h2>Scoreboard</h2><table class="scoreboard-table">'
    
    let totalRunCount = 0;
    let totalWicketCount = 0;
    let totalExtraRunCount = 0; 
    let totalExtraBallCount = 0;
    let totalBallCount = 0;
    
    
    for(let i=0;i<overs.length;i++)
    {
        let overRunCount = 0;
        let overWicketCount = 0;
        let overBallCount = 0;
        let overExtraRunCount = 0;
        let overExtraBallCount = 0;
        let ballsUI = ''
        for(let j=0;j<overs[i].length;j++)
        {
            overRunCount+=overs[i][j].run
            if(overs[i][j].wicket)
                overWicketCount++
            if(overs[i][j].countable)
                overBallCount++
            else
            {
                overExtraRunCount+=overs[i][j].run
                overExtraBallCount++
            }
            ballsUI+=getBallUI(overs[i][j])
        }

        totalRunCount+=overRunCount
        totalWicketCount+=overWicketCount
        totalExtraRunCount+=overExtraRunCount
        totalExtraBallCount+=overExtraBallCount
        totalBallCount+=overBallCount
        scoreboardUI+='<tr><td>'+(i+1)+'</td><td class="overScore">'+ballsUI+'</td></tr>'
    }
    if(balls.length>0)
    {
        let overRunCount = 0;
        let overWicketCount = 0;
        let overBallCount = 0;
        let overExtraRunCount = 0;
        let overExtraBallCount = 0;
        let ballsUI = ''
        for(let j=0;j<balls.length;j++)
        {
            overRunCount+=balls[j].run
            if(balls[j].wicket)
                overWicketCount++
            if(balls[j].countable)
                overBallCount++
            else
            {
                overExtraRunCount+=balls[j].run
                overExtraBallCount++
            }
            ballsUI+=getBallUI(balls[j])
        }
            totalRunCount+=overRunCount
        totalWicketCount+=overWicketCount
        totalExtraRunCount+=overExtraRunCount
        totalExtraBallCount+=overExtraBallCount
        totalBallCount+=overBallCount
        scoreboardUI+='<tr><td>'+(overs.length+1)+'</td><td class="overScore">'+ballsUI+'</td></tr>'
    }

    scoreboardUI+='</table><div class="scoreinfo"><h3>Total: <span>'+(totalRunCount)+'</span></h3><h3>ER: <span>'+(totalExtraRunCount)+'</span></h3><h3>EB: <span>'+(totalExtraBallCount)+'</span></h3><h3>Wicket: <span>'+(totalWicketCount)+'</span></h3></div></div>'
    document.getElementById('overlay-content').innerHTML = scoreboardUI
    document.getElementById('overlay').style.display='block'

}

function getBallUI(ball)
{
    let ballUI = ''
    if(ball.type=='run')
    {
        let ballClass='ball runBall'
        if (ball.countable)
            ballClass+=' countable'
        ballUI+='<span class="'+ballClass+'">'+ball.run+'</span>'
    }
    else if(ball.type=='wide')
    {
        let ballClass='ball wideBall'
        if (ball.countable)
            ballClass+=' countable'
        if(ball.run>1)
            ballUI+='<span class="'+ballClass+'">'+ball.run+'WD</span>'
        else
            ballUI+='<span class="'+ballClass+'">WD</span>'

    }
    else if(ball.type=='noBall')
    {   
        let ballClass='ball noBall'
        if (ball.countable)
            ballClass+=' countable'
        if(ball.run>1)
            ballUI+='<span class="'+ballClass+'">'+ball.run+'N</span>'
        else
            ballUI+='<span class="'+ballClass+'">N</span>'
    }
    else if(ball.type=='four')
    {
        let ballClass='ball fourBall'
        if (ball.countable)
            ballClass+=' countable'
        ballUI+='<span class="'+ballClass+'">4</span>'
    }
    else if(ball.type=='six')
    {
        let ballClass='ball sixBall'
        if (ball.countable)
            ballClass+=' countable'
        ballUI+='<span class="'+ballClass+'">6</span>'
    }
    else if(ball.type=='out')
    {
        let ballClass='ball outBall'
        if (ball.countable)
            ballClass+=' countable'
        if(ball.run>0)
            ballUI+='<span class="'+ballClass+'">'+ball.run+'W</span>'
        else
            ballUI+='<span class="'+ballClass+'">W</span>'
    }
    else if(ball.type=='dot')
    {
        let ballClass='ball dotBall'
        if (ball.countable)
            ballClass+=' countable'
        ballUI+='<span class="'+ballClass+'"><div class="dot"></div></span>'
    }
    return ballUI
}
function refreshUI()
{
    runCount = 0;
    overCount = 0;
    wicketCount = 0;
    ballCount = 0;
    let totalBall = 0;
    let lastOverRunCount = 0;
    let lastOverBallsUI = '';
    let lastOverBallCount = 0;

    let displayBallCount=0;
    let displayOverCount=0;
    for (let i = 0; i < overs.length; i++) {
        ballCount=0;
        lastOverRunCount=0
        lastOverBallsUI = ''
        for (let j = 0; j < overs[i].length; j++) {
            runCount+=overs[i][j].run
            lastOverRunCount+=overs[i][j].run
            if(overs[i][j].wicket)
                wicketCount++
            if(overs[i][j].countable)
            {
                ballCount++
                totalBall++
            }   
            lastOverBallsUI+=getBallUI(overs[i][j])
        }
        lastOverBallCount = ballCount
        if(ballCount==6)
        {
            overCount++
            ballCount=0
        }
    }
    
    displayOverCount=overCount;
    displayBallCount=ballCount;

    if(balls.length>0)
    {
        ballCount=0;
        lastOverRunCount=0
        lastOverBallsUI = ''
        for (let j = 0; j < balls.length; j++) {
            runCount+=balls[j].run
            lastOverRunCount+=balls[j].run
            if(balls[j].wicket)
                wicketCount++
            if(balls[j].countable)
            {
                ballCount++
                totalBall++
            }   
            lastOverBallsUI+=getBallUI(balls[j])
        }
        lastOverBallCount=ballCount

        displayOverCount = overCount
        displayBallCount = ballCount

        if(ballCount==6)
        {
            displayOverCount++
            displayBallCount=0
        }
    }
    

    document.getElementById('run').innerHTML = runCount;
    document.getElementById('wicket').innerHTML = wicketCount;
    document.getElementById('over').innerHTML = displayOverCount;
    document.getElementById('ball').innerHTML = displayBallCount;
    if(lastOverBallCount==0)
        document.getElementById('crr').innerHTML = 0;
    else
        document.getElementById('crr').innerHTML = getRunRate('crr');
    if(totalBall==0)
        document.getElementById('orr').innerHTML = 0;
    else
        document.getElementById('orr').innerHTML = getRunRate('orr');
    if(lastOverBallsUI!='')
        document.getElementById('ballsUI').innerHTML = lastOverBallsUI;
    else
        document.getElementById('ballsUI').innerHTML = 'Waiting for first ball...';
}
function getRunRate(type)
{
    if(type=='crr')
    {
        if(balls.length>0)
        {
            let lastOverRunCount = 0;
            let lastOverBallCount = 0;
            for(let j=0;j<balls.length;j++)
            {
                lastOverRunCount+=balls[j].run
                if(balls[j].countable)
                    lastOverBallCount++
            }
            return ((lastOverRunCount/lastOverBallCount)*6).toFixed(1)
        }
        else if(overs.length>0)
        {
            let lastOverRunCount = 0;
            let lastOverBallCount = 0;
            for(let j=0;j<overs[overs.length-1].length;j++)
            {
                lastOverRunCount+=overs[overs.length-1][j].run
                if(overs[overs.length-1][j].countable)
                    lastOverBallCount++
            }
            return ((lastOverRunCount/lastOverBallCount)*6).toFixed(1)
        }
        return -1;
    }
    else if(type=='orr')
    {
        let totalRunCount = 0;
        let totalBallCount = 0;
        for(let i=0;i<overs.length;i++)
        {
            for(let j=0;j<overs[i].length;j++)
            {
                totalRunCount+=overs[i][j].run
                if(overs[i][j].countable)
                    totalBallCount++
            }
        }
        for(let j=0;j<balls.length;j++)
        {
            totalRunCount+=balls[j].run
            if(balls[j].countable)
                totalBallCount++
        }
        return ((totalRunCount/totalBallCount)*6).toFixed(1)
    }
}
function storeScore()
{
    // Store over and balls in storage
    localStorage.setItem('overs',JSON.stringify(overs))
    localStorage.setItem('balls',JSON.stringify(balls))
}
refreshUI()


document.getElementById('dotButton').addEventListener('click',function(){
    addBall(true,0,0,false,'dot')
})
document.getElementById('wideButton').addEventListener('click',function(){
    addBall(false,1,0,false,'wide')
})
document.getElementById('fourButton').addEventListener('click',function(){
    addBall(true,4,0,false,'four')
})
document.getElementById('sixButton').addEventListener('click',function(){
    addBall(true,6,0,false,'six')
})


document.getElementById('noBallButton').addEventListener('click',function(){
    // <div class="scorepad">
    // <button class="scorepad-button">Dot</button>
    // <button class="scorepad-button">Four</button>
    // <button class="scorepad-button">Six</button>
    // <button class="scorepad-button">Run</button>
    // <button class="scorepad-button">Out</button>
    // </div>
    
    let noBallScorepad = document.createElement("div");
    noBallScorepad.classList.add('scorepad')
    let dotButton = document.createElement("button");
    dotButton.classList.add('scorepad-button')
    dotButton.innerHTML = 'Dot'
    dotButton.addEventListener('click',function(){
        addBall(false,1+0,0,false,'noBall')
        closeOverlay()
    })
    let fourButton = document.createElement("button");
    fourButton.classList.add('scorepad-button')
    fourButton.innerHTML = 'Four'
    fourButton.addEventListener('click',function(){
        addBall(false,1+4,0,false,'noBall')
        closeOverlay()
    })
    let sixButton = document.createElement("button");
    sixButton.classList.add('scorepad-button')
    sixButton.innerHTML = 'Six'
    sixButton.addEventListener('click',function(){
        addBall(false,1+6,0,false,'noBall')
        closeOverlay()
    })

    let runButton = document.createElement("button");
    runButton.classList.add('scorepad-button')
    runButton.innerHTML = 'Run'
    runButton.addEventListener('click',function(){
        let noBallRunScorepad = document.createElement("div");
        noBallRunScorepad.classList.add('scorepad')
        let oneRunButton = document.createElement("button");
        oneRunButton.classList.add('scorepad-button')
        oneRunButton.innerHTML = 'One'
        oneRunButton.addEventListener('click',function(){
            addBall(false,1+1,0,false,'noBall')
            closeOverlay()
        })
        let twoRunButton = document.createElement("button");
        twoRunButton.classList.add('scorepad-button')
        twoRunButton.innerHTML = 'Two'
        twoRunButton.addEventListener('click',function(){
            addBall(false,1+2,0,false,'noBall')
            closeOverlay()
        })
        let threeRunButton = document.createElement("button");
        threeRunButton.classList.add('scorepad-button')
        threeRunButton.innerHTML = 'Three'
        threeRunButton.addEventListener('click',function(){
            addBall(false,1+3,0,false,'noBall')
            closeOverlay()
        })
        let customRunButton = document.createElement("button");
        customRunButton.classList.add('scorepad-button')
        customRunButton.innerHTML = 'Custom'
        customRunButton.addEventListener('click',function(){
            let run = prompt('How much run?')
            if (run === '' || isNaN(run) || parseInt(run) < 0 || run==null)
            {
                alert("Invalid Input")
                return;
            }
            else
            {
                run = parseInt(run);
                addBall(false,1+run,0,false,'noBall')
            }
            closeOverlay()
        })
        document.getElementById('overlay-content').innerHTML = ''
        noBallRunScorepad.appendChild(oneRunButton)
        noBallRunScorepad.appendChild(twoRunButton)
        noBallRunScorepad.appendChild(threeRunButton)
        noBallRunScorepad.appendChild(customRunButton)
        document.getElementById('overlay-content').appendChild(noBallRunScorepad)
        document.getElementById('overlay').style.display='block'

    })

    let outButton = document.createElement("button");
    outButton.classList.add('scorepad-button')
    outButton.innerHTML = 'Out'
    outButton.addEventListener('click',function(){
        let noBallOutScorepad = document.createElement("div");
        noBallOutScorepad.classList.add('scorepad')
        let runOutButton = document.createElement("button");
        runOutButton.classList.add('scorepad-button')
        runOutButton.innerHTML = 'Run Out'
        runOutButton.addEventListener('click',function(){
            // Here could be a prompt to enter run
            let runOutScorepad = document.createElement("div");
            runOutScorepad.classList.add('scorepad')
            let zeroRunButton = document.createElement("button");
            zeroRunButton.classList.add('scorepad-button')
            zeroRunButton.innerHTML = 'Zero'
            zeroRunButton.addEventListener('click',function(){
                addBall(false,0+1,1,'runOut','out')
                closeOverlay()
            })
            let oneRunButton = document.createElement("button");
            oneRunButton.classList.add('scorepad-button')
            oneRunButton.innerHTML = 'One'
            oneRunButton.addEventListener('click',function(){
                addBall(false,1+1,1,'runOut','out')
                closeOverlay()
            })
            let twoRunButton = document.createElement("button");
            twoRunButton.classList.add('scorepad-button')
            twoRunButton.innerHTML = 'Two'
            twoRunButton.addEventListener('click',function(){
                addBall(false,2+1,1,'runOut','out')
                closeOverlay()
            })
            let customRunButton = document.createElement("button");
            customRunButton.classList.add('scorepad-button')
            customRunButton.innerHTML = 'Custom'
            customRunButton.addEventListener('click',function(){
                let run = prompt('How much run?')
                if (run === '' || isNaN(run) || parseInt(run) < 0 || run==null)
                {
                    alert("Invalid Input")
                    return;
                }
                else
                {
                    run = parseInt(run);
                    addBall(false,1+run,1,'runOut','out')
                }
                closeOverlay()
            })
            document.getElementById('overlay-content').innerHTML = ''
            runOutScorepad.appendChild(zeroRunButton)
            runOutScorepad.appendChild(oneRunButton)
            runOutScorepad.appendChild(twoRunButton)
            runOutScorepad.appendChild(customRunButton)
            document.getElementById('overlay-content').appendChild(runOutScorepad)
            document.getElementById('overlay').style.display='block'
        })
        
    document.getElementById('overlay-content').innerHTML = ''
    noBallOutScorepad.appendChild(runOutButton)
    document.getElementById('overlay-content').appendChild(noBallOutScorepad)
    document.getElementById('overlay').style.display='block'
    })

    document.getElementById('overlay-content').innerHTML = ''
    noBallScorepad.appendChild(dotButton)
    noBallScorepad.appendChild(fourButton)
    noBallScorepad.appendChild(sixButton)
    noBallScorepad.appendChild(runButton)
    noBallScorepad.appendChild(outButton)
    document.getElementById('overlay-content').appendChild(noBallScorepad)
    document.getElementById('overlay').style.display='block'

})
document.getElementById('runButton').addEventListener('click',function(){
    // <div class="scorepad">
    // <button class="scorepad-button">One</button>
    // <button class="scorepad-button">Two</button>
    // <button class="scorepad-button">Three</button>
    // <button class="scorepad-button">Custom</button>
    // </div>
    
    let runScorepad = document.createElement("div");
    runScorepad.classList.add('scorepad')
    let oneRunButton = document.createElement("button");
    oneRunButton.classList.add('scorepad-button')
    oneRunButton.innerHTML = 'One'
    oneRunButton.addEventListener('click',function(){
        addBall(true,1,0,false,'run')
        closeOverlay()
    })
    let twoRunButton = document.createElement("button");
    twoRunButton.classList.add('scorepad-button')
    twoRunButton.innerHTML = 'Two'
    twoRunButton.addEventListener('click',function(){
        addBall(true,2,0,false,'run')
        closeOverlay()
    })
    let threeRunButton = document.createElement("button");
    threeRunButton.classList.add('scorepad-button')
    threeRunButton.innerHTML = 'Three'
    threeRunButton.addEventListener('click',function(){
        addBall(true,3,0,false,'run')
        closeOverlay()
    })
    let customRunButton = document.createElement("button");
    customRunButton.classList.add('scorepad-button')
    customRunButton.innerHTML = 'Custom'
    customRunButton.addEventListener('click',function(){
        let run = prompt('How much run?')
        if (run === '' || isNaN(run) || parseInt(run) < 0 || run==null)
        {
            alert("Invalid Input")
            return;
        }
        else
        {
            run = parseInt(run);
            addBall(true,run,0,false,'run')
        }
        closeOverlay()
    });

    document.getElementById('overlay-content').innerHTML = ''
    runScorepad.appendChild(oneRunButton)
    runScorepad.appendChild(twoRunButton)
    runScorepad.appendChild(threeRunButton)
    runScorepad.appendChild(customRunButton)
    document.getElementById('overlay-content').appendChild(runScorepad)
    document.getElementById('overlay').style.display='block'

})
document.getElementById('outButton').addEventListener('click',function(){
    // <div class="scorepad">
    // <button class="scorepad-button">Bowled</button>
    // <button class="scorepad-button">Catch</button>
    // <button class="scorepad-button">LBW</button>
    // <button class="scorepad-button">Run Out</button>
    // <button class="scorepad-button">Stumped</button>
    // <button class="scorepad-button">Hit Wicket</button>
    // </div>
    
    let outScorepad = document.createElement("div");
    outScorepad.classList.add('scorepad')
    let bowledButton = document.createElement("button");
    bowledButton.classList.add('scorepad-button')
    bowledButton.innerHTML = 'Bowled'
    bowledButton.addEventListener('click',function(){
        addBall(true,0,1,'bowled','out')
        closeOverlay()
    })
    let catchButton = document.createElement("button");
    catchButton.classList.add('scorepad-button')
    catchButton.innerHTML = 'Catch'
    catchButton.addEventListener('click',function(){
        addBall(true,0,1,'catch','out')
        closeOverlay()
    })
    let lbwButton = document.createElement("button");
    lbwButton.classList.add('scorepad-button')
    lbwButton.innerHTML = 'LBW'
    lbwButton.addEventListener('click',function(){
        addBall(true,0,1,'lbw','out')
        closeOverlay()
    })
    let runOutButton = document.createElement("button");
    runOutButton.classList.add('scorepad-button')
    runOutButton.innerHTML = 'Run Out'
    runOutButton.addEventListener('click',function(){
        // Here could be a prompt to enter run
        let runOutScorepad = document.createElement("div");
        runOutScorepad.classList.add('scorepad')
        let zeroRunButton = document.createElement("button");
        zeroRunButton.classList.add('scorepad-button')
        zeroRunButton.innerHTML = 'Zero'
        zeroRunButton.addEventListener('click',function(){
            addBall(true,0,1,'runOut','out')
            closeOverlay()
        })
        let oneRunButton = document.createElement("button");
        oneRunButton.classList.add('scorepad-button')
        oneRunButton.innerHTML = 'One'
        oneRunButton.addEventListener('click',function(){
            addBall(true,1,1,'runOut','out')
            closeOverlay()
        })
        let twoRunButton = document.createElement("button");
        twoRunButton.classList.add('scorepad-button')
        twoRunButton.innerHTML = 'Two'
        twoRunButton.addEventListener('click',function(){
            addBall(true,2,1,'runOut','out')
            closeOverlay()
        })
        let customRunButton = document.createElement("button");
        customRunButton.classList.add('scorepad-button')
        customRunButton.innerHTML = 'Custom'
        customRunButton.addEventListener('click',function(){
            let run = prompt('How much run?')
            if (run === '' || isNaN(run) || parseInt(run) < 0 || run==null)
            {
                alert("Invalid Input")
                return;
            }
            else
            {
                run = parseInt(run);
                addBall(true,run,1,'runOut','out')
            }
            closeOverlay()
        })
        document.getElementById('overlay-content').innerHTML = ''
        runOutScorepad.appendChild(zeroRunButton)
        runOutScorepad.appendChild(oneRunButton)
        runOutScorepad.appendChild(twoRunButton)
        runOutScorepad.appendChild(customRunButton)
        document.getElementById('overlay-content').appendChild(runOutScorepad)
        document.getElementById('overlay').style.display='block'
    })
    let stumpedButton = document.createElement("button");
    stumpedButton.classList.add('scorepad-button')
    stumpedButton.innerHTML = 'Stumped'
    stumpedButton.addEventListener('click',function(){
        addBall(true,0,1,'stumped','out')
        closeOverlay()
    })
    let hitWicketButton = document.createElement("button");
    hitWicketButton.classList.add('scorepad-button')
    hitWicketButton.innerHTML = 'Hit Wicket'
    hitWicketButton.addEventListener('click',function(){
        addBall(true,0,1,'hitWicket','out')
        closeOverlay()
    });

    document.getElementById('overlay-content').innerHTML = ''
    outScorepad.appendChild(bowledButton)
    outScorepad.appendChild(catchButton)
    outScorepad.appendChild(lbwButton)
    outScorepad.appendChild(runOutButton)
    outScorepad.appendChild(stumpedButton)
    outScorepad.appendChild(hitWicketButton)
    document.getElementById('overlay-content').appendChild(outScorepad)
    document.getElementById('overlay').style.display='block'

})

document.getElementById('undoButton').addEventListener('click',function(){
    if(confirm('Are you sure to undo last ball?'))
        undoBall()
})

document.getElementById('resetButton').addEventListener('click',function(){
    var randomNumber = Math.floor(1000 + Math.random() * 9000);
    if(prompt('Enter '+randomNumber+' to confirm reset') == randomNumber)
        reset(true)
    else
        alert('Reset Failed')
})
document.getElementById('scoreboardButton').addEventListener('click',function(){
    scoreboard()
})

document.getElementById('close-button').addEventListener('click',function(){
    closeOverlay()
})


if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('js/service-worker.js')
        .then(registration => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
        .catch(error => {
          console.log('ServiceWorker registration failed: ', error);
        });
    });
}