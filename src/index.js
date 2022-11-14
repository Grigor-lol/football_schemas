import * as d3 from "d3";

const plotscale = 750

const strokeWidth = 3
const margin = {top: (plotscale * (14.86/960)),
        right: (plotscale * (20/960)),
        bottom: (plotscale * (24/960)),
        left: (plotscale* (40/960))},
    width = plotscale - margin.left - margin.right,
    height = (plotscale * (68/105) - margin.top - margin.bottom) ;
console.log(68/105, height/width)

const x = d3.scaleLinear()
    .domain([0, 100])
    .range([0, width]);

const y = d3.scaleLinear()
    .domain([0, 100])
    .range([height, 0]);


const svg = d3.select("svg")
    .attr("height", width + margin.left + margin.right)
    .attr("width", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(470 20) rotate(90 0 0)")


svg.append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("class", "mesh")
    .attr("width", width)
    .attr("height", height);


///////////////////////


// field outline
svg.append("rect")
    .attr("id","outline")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "green")
    .attr("stroke", "white")
    .attr("stroke-width", strokeWidth)

// right penalty area
svg.append("rect")
    .attr("id","six")
    .attr("x", x(83))
    .attr("y", y(78.9))
    .attr("width", x(100) - x(83))
    .attr("height", y(21.1) - y(78.9))
    .attr("fill", "green")
    .attr("stroke", "white")
    .attr("stroke-width", strokeWidth)
// right six yard box
svg.append("rect")
    .attr("id","penarea")
    .attr("x", x(94.2))
    .attr("y", y(63.2))
    .attr("width", x(100) - x(94.2))
    .attr("height", y(36.8) - y(63.2))
    .attr("fill", "green")
    .attr("stroke", "white")
    .attr("stroke-width", strokeWidth)

// left penalty area
svg.append("rect")
    .attr("id","six")
    .attr("x", x(0))
    .attr("y", y(78.9))
    .attr("width", x(100) - x(83))
    .attr("height", y(21.1) - y(78.9))
    .attr("fill", "green")
    .attr("stroke", "white")
    .attr("stroke-width", strokeWidth)

// six yard box
svg.append("rect")
    .attr("id","penarea")
    .attr("x", x(0))
    .attr("y", y(63.2))
    .attr("width", x(100) - x(94.2))
    .attr("height", y(36.8) - y(63.2))
    .attr("fill", "green")
    .attr("stroke", "white")
    .attr("stroke-width", strokeWidth)

// 50 yd line
svg.append("line")
    .attr("id","half")
    .attr("x1", x(50))
    .attr("x2", x(50))
    .attr("y1", y(0))
    .attr("y2", y(100))
    .attr("stroke", "white")
    .attr("stroke-width", strokeWidth)

// center circle
svg.append("circle")
    .attr("cx", x(50))
    .attr("cy", y(50))
    .attr("r", x(10))
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-width", strokeWidth)

svg.append("circle")
    .attr("cx", x(50))
    .attr("cy", y(50))
    .attr("r", x(1))
    .attr("fill", "white")
    .attr("stroke", "white")
    .attr("stroke-width", strokeWidth)

/////////////////////////////////////////////

function dragstarted(d) {
        d3.select(this).raise().classed("active", true);
}

function dragged(event, d) {
        d3.select(this).attr("cx", d.x = event.x).attr("cy", d.y = event.y);

}

function dragended(d) {
        d3.select(this).classed("active", false);
}


//////////////////////////////
function drawScheme(svg, scheme){
        const colors = ['#fdcb6e', '#d63031','#0984e3','#e84393']
        svg.selectAll('.player').remove();
        const circleMatrix = scheme.map((val,index) => {
                console.log('value', val);
                console.log('index', index);
                const verticalStep = width / scheme.length;
                const verticalWidth = verticalStep * (scheme.length - 1)
                const verticalDer = (width / 2) - (verticalWidth / 2);
                return d3.range(val).map(i =>{
                        const horizontalStep = height / val;
                        const horizontalWidth = horizontalStep * (val - 1)
                        const horizontalDer = (height / 2) - (horizontalWidth / 2);
                        console.log(svg.height,'svg.height');
                        return {
                                x:  (scheme.length - index) * verticalStep - verticalDer,
                                y: (val - i) * horizontalStep - horizontalDer,
                                id: i+1,
                                color: colors[index]
                        };
                })
        });
        let circles = [];
        circleMatrix.forEach(x => {
                circles.push(...x);
        });
        console.log(circles,'circles');
        const radius = 25
        svg.selectAll(".player")

            .data(circles)
            .enter().append("circle")
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; })
            .attr("r", radius)
            .attr('class', 'player')
            .style("fill", d => d.color)
            .on("mouseover", function (d) {d3.select(this).style("cursor", "move");})
            .on("mouseout", function (d) {})
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended)
            );
}
function createGameSchemeList(schemeArray, svg, drawScheme){
        return schemeArray.map(scheme => {
                const button = document.createElement('button');
                button.classList.add('list-group-item', 'list-group-item-action');
                button.setAttribute('type', 'button');

                button.innerText = scheme.join('-');
                button.onclick = () => { drawScheme(svg, scheme) };
                return button;
        });
}

const schemeList = document.getElementById('scheme-list');
const gamersPosition = [[4,3,3],[4,4,2],[3,5,2],[3,4,3],[4,2,4],[4,3,2,1]];
schemeList.append(...createGameSchemeList(gamersPosition, svg, drawScheme));

/////////////////////////////////////////////////////////////
