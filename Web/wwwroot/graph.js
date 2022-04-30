import { ContextMenu } from './context-menu.js';

window.RenderGraph = async (dotString) => {
    window.graphviz.renderDot(dotString);
    console.log(dotString);
}

window.InitGraph = (element, csharpObjectRef) => {
    
    var graph = d3.select(element);
    window.csharpGraphRef = csharpObjectRef;

    window.contextMenu = new ContextMenu(element);
    
    window.graphviz = graph.graphviz()
        .fit(true)
        .transition(function () {
            return d3.transition("main")
                .ease(d3.easeQuadInOut)
                .duration(750);
        })
        //.tweenShapes(false)
        //.tweenPaths(false)
        .on('renderEnd', () => {
            window.csharpGraphRef.invokeMethodAsync('JsRenderingFinished');
        })
        .on('end', () => {
            let transitions = element.querySelectorAll('.transition');
            [...transitions].forEach((t) => {
                let text = t.querySelector('text');
                let title = t.querySelector('title');
                let polygon = t.querySelector('polygon');
                text.setAttribute("pointer-events", "none");
                title.setAttribute("pointer-events", "none");
                if (!["<<start>>", "<<end>>"].includes(t.id)) {
                    polygon.classList.add('hasContextMenu');
                }
            });

            rebuildContextMenu();
        });
};

const rebuildContextMenu = () => {
    window.contextMenu.disconnect();
    window.contextMenu.registerCommands([
        {
            target: '.hasContextMenu',
            label: 'hide',
            execute: (ctx) => { 
                console.log(ctx.target.parentNode.querySelector('text'));
                window.csharpGraphRef.invokeMethodAsync('HideTransition', ctx.target.parentNode.id) }
        },
        {
            target: '.hasContextMenu',
            label: 'color',
            children: [
                {
                    label: 'white',
                    id: 'white',
                    enabled: (ctx) => ctx.target.getAttribute('fill') !== ctx.id,
                    execute: (ctx) => window.csharpGraphRef.invokeMethodAsync('ChangeTransitionColor', ctx.target.parentNode.id, ctx.id)
                },
                {
                    label: 'red',
                    id: 'red',
                    enabled: (ctx) => ctx.target.getAttribute('fill') !== ctx.id,
                    execute: (ctx) => window.csharpGraphRef.invokeMethodAsync('ChangeTransitionColor', ctx.target.parentNode.id, ctx.id)
                },
                {
                    label: 'green',
                    id: 'green',
                    enabled: (ctx) => ctx.target.getAttribute('fill') !== ctx.id,
                    execute: (ctx) => window.csharpGraphRef.invokeMethodAsync('ChangeTransitionColor', ctx.target.parentNode.id, ctx.id)
                },
            ],
        },
    ]);
    window.contextMenu.connect();
}


window.ResetZoom = async () => {
    window.graphviz.resetZoom();
}