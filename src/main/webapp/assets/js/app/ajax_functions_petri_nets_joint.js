/**JOINT JS configuration*/
var graph = new joint.dia.Graph();
var paper = new joint.dia.Paper({
    el: document.getElementById('cy'),
    width: "100%",
    height: 2500, //resize dynamically?
    gridSize: 10,
    defaultAnchor: { name: 'perpendicular' },
    defaultConnectionPoint: { name: 'boundary' },
    model: graph,
	
	//embedding: group of nodes
	snapLinks: true,
    linkPinning: false,
    embeddingMode: true,
    clickThreshold: 5,
    defaultConnectionPoint: { name: 'boundary' },
	highlighting: {
        'default': {
            name: 'stroke',
            options: {
                padding: 6
            }
        },
        'embedding': {
            name: 'addClass',
            options: {
                className: 'highlighted-parent'
            }
        }
    },

    validateEmbedding: function(childView, parentView) {
        return parentView.model instanceof joint.shapes.devs.Coupled;
    },

    validateConnection: function(sourceView, sourceMagnet, targetView, targetMagnet) {
        return sourceMagnet != targetMagnet;
    }
	 
});

//Create Petri net
var pn = joint.shapes.pn;

var simulationId = null;


/*Dynamic petri net creation*/
function createPlace(id, label, pos_x, pos_y, tokens) {
	var pNode = new pn.Place();
	//common attributes
	pNode.attr('.label/fill', '#000000')
	//label orientation
	pNode.attr('.label/textAnchor', 'middle')
	pNode.attr('.label/refX', '80%')
	pNode.attr('.label/refY', '50%')
	pNode.attr('.label/fontSize', 14)
	
	pNode.attr('.root/stroke', '#000000');
	pNode.attr('.root/stroke-width', 2);
	pNode.attr('.tokens > circle/fill', '#000000');
	
	pNode.size(30, 30);
	
	//specific attributes
	pNode.set('id', id);
	pNode.attr('.label/text', label);
	pNode.position(pos_x, pos_y);
	pNode.set('tokens', tokens);
	
	return pNode;
}

function createTransition(id, label, pos_x, pos_y, orientation) {
	var pNode = new pn.Transition();
	//common attributes
	pNode.attr('.label/fill', '#000000')
	
	//label orientation
	pNode.attr('.label/textAnchor', 'middle')
	pNode.attr('.label/refX', '80%')
	pNode.attr('.label/refY', '50%')
	pNode.attr('.label/fontSize', 14)
	
	pNode.attr('.root/fill', '#000000');
	pNode.attr('.root/stroke', '#000000');
	pNode.attr('.root/stroke-width', 2);
	
	if(orientation == 0)
		pNode.size(10, 30);
	else
		pNode.size(30, 10);
	//specific attributes
	pNode.set('id', id);
	pNode.attr('.label/text', label);
	pNode.position(pos_x, pos_y);
	
	return pNode;
}

/**
 * @param id
 * @param text
 * @param pos_x
 * @param pos_y
 * @param width
 * @param height
 * @param parent_group main group
 * @returns
 */
function createGroup(id, label, pos_x, pos_y, parent_group, width, height) {
	var group;
	if(parent_group == true) 
		group = new joint.shapes.devs.Coupled();
	else
		group = new joint.shapes.devs.Atomic();
	/*
	//common attributes
	group.attr('.label/fill', '#fe854f')
	
	//label orientation
	group.attr('.label/textAnchor', 'middle')
	group.attr('.label/refX', '80%')
	group.attr('.label/refY', '50%')
	group.attr('.label/fontSize', 14)
	
	group.attr('.root/fill', '#9586fd');
	group.attr('.root/stroke', '#9586fd');
	group.attr('.root/stroke-width', 2);
	
	
	
	*/
		
	//specific attributes
	group.size(width, height);
	
	group.set('id', id);
	group.attr('.label/text', label);
	group.position(pos_x, pos_y);
	
	return group;
}

function updateGroupSize(group, width, height, jsonGroupNodes){
	var index = jsonGroupNodes.indexOf(group);
	group.size(width, height);
	if (index !== -1) {
		jsonGroupNodes[index] = group;
	}
	return group;
}

/*Find a node: place or transition by Id */
function findNodeById(id, nodes) {
	return nodes.find(node => node.id === id);
}

function link(a, b) {

    return new pn.Link({
        source: { id: a.id, selector: '.root' },
        target: { id: b.id, selector: '.root' },
        attrs: {
            '.connection': {
                'fill': 'none',
                'stroke-linejoin': 'round',
                'stroke-width': '2',
                'stroke': '#4b4a67'
            }
        }
    });
}

function linkById(a_id, b_id) {

    return new pn.Link({
        source: { id: a_id, selector: '.root' },
        target: { id: b_id, selector: '.root' },
        attrs: {
            '.connection': {
                'fill': 'none',
                'stroke-linejoin': 'round',
                'stroke-width': '2',
                'stroke': '#4b4a67'
            },
            //other attributes
	        '.link-tools': {
	            display: 'none' //disable remove link
	        }
        }
    });
}

//Petri Net Simulation
function fireTransition(t, sec, color_hex_mark) {

    var inbound = graph.getConnectedLinks(t, { inbound: true });
    var outbound = graph.getConnectedLinks(t, { outbound: true });

    var placesBefore = inbound.map(function(link) {
        return link.getSourceElement();
    });
    var placesAfter = outbound.map(function(link) {
        return link.getTargetElement();
    });

    var isFirable = true;
    placesBefore.forEach(function(p) {
        if (p.get('tokens') <= 0) {
            isFirable = false;
        }
    });

    if (isFirable) {

        placesBefore.forEach(function(p) {
            //enable transition
			t.attr('.label/fill', color_hex_mark);
			t.attr('.root/fill', color_hex_mark);
			t.attr('.root/stroke', color_hex_mark);
			// Let the execution finish before adjusting the value of tokens. So that we can loop over all transitions
            // and call fireTransition() on the original number of tokens.
            setTimeout(function() {
                p.set('tokens', p.get('tokens') > 0 ? p.get('tokens') - 1: 0);
            }, 0);

            var links = inbound.filter(function(l) {
                return l.getSourceElement() === p;
            });

            links.forEach(function(l) {
                var token = V('circle', { r: 7, fill: '#feb662' });
                l.findView(paper).sendToken(token, sec * 1000);
            });
        });

        placesAfter.forEach(function(p) {

            var links = outbound.filter(function(l) {
                return l.getTargetElement() === p;
            });

            links.forEach(function(l) {
                var token = V('circle', { r: 7, fill: '#b6092e' });
                l.findView(paper).sendToken(token, sec * 1000, function() {
                    p.set('tokens', p.get('tokens') === 0 ? 1: p.get('tokens') + 1);
					//disable transition
					t.attr('.label/fill', '#000000');
					t.attr('.root/fill', '#999999');
					t.attr('.root/stroke', '#999999');
                });
            });
        });
    }
}
// JSON transitions
function simulate(transitions, color_hex_mark) {
	
    transitions.forEach(function(t) {
        if (Math.random() < 0.7) {
            fireTransition(t, 1, color_hex_mark);
        }
    });

    return setInterval(function() {
        transitions.forEach(function(t) {
            if (Math.random() < 0.7) {
                fireTransition(t, 1, color_hex_mark);
            }
        });
    }, 2000);
}

function simulateHappyPath(transitions) {
	
	if(simulationId != null)
		stopSimulation(simulationId);
    
    simulate(transitions, "#4b9f27");
}

function simulateDeadlock(pathToDeadlock) {
	if(simulationId != null)
		stopSimulation(simulationId);
	var path = [];
	if(pathToDeadlock)
		path = JSON.parse(pathToDeadlock);

	//Save transitions (JSON) for firing
	var transitions = [];

	
	for(let i = 0; i < path.length; i++) {
		let idTransition = path[i];	
		var transition = graph.getCell(idTransition);
		transitions.push(transition);
		
	}
	
	simulate(transitions, "#E1AD0F");
	
}

function simulateOverflow(placesToOverflow) {
	if(simulationId != null)
		stopSimulation(simulationId);
	//location.reload();
	var overflow = [];
	if(placesToOverflow)
		overflow = JSON.parse(placesToOverflow);

	//Save places (JSON) for highlighting
	var places = [];
	
	for(let i = 0; i < overflow.length; i++) {
		let id = overflow[i];	
		var place = graph.getCell(id);
		places.push(place);
	}
	
	places.forEach(function(p) {		
		p.set('tokens', Number.POSITIVE_INFINITY);
		p.attr('.label/fill', '#f44336');

		p.attr('.root/stroke', '#f44336');
		p.attr('.tokens > circle/fill', '#f44336');
	});
}

function simulateNeverEnabledTransitions(neverEnabledTransitions) {
	if(simulationId != null)
		stopSimulation(simulationId);
	//location.reload();
	var never = [];
	if(neverEnabledTransitions)
		never = JSON.parse(neverEnabledTransitions);

	//Save transitions (JSON) for highlighting
	var transitions = [];
	
	for(let i = 0; i < never.length; i++) {
		let id = never[i];	
		var transition = graph.getCell(id);
		transitions.push(transition);
	}
	
	transitions.forEach(function(t) {		
		t.attr('.label/fill', '#1D61E1');
		
		t.attr('.root/fill', '#1D61E1');
		t.attr('.root/stroke', '#1D61E1');
	});
}

function simulateNonDeterminism(nonDeterminismTransitions) {
	if(simulationId != null)
		stopSimulation(simulationId);
	//location.reload();
	
	var nonDeterminism = [];
	if(nonDeterminismTransitions)
		nonDeterminism = JSON.parse(nonDeterminismTransitions);

	//Save transitions (JSON) for highlighting
	var transitions = [];
	
	for(let i = 0; i < nonDeterminism.length; i++) {
		let setTransitions = nonDeterminism[i];
		for(let j = 0; j < setTransitions.length; j++) {
			let id = setTransitions[j];	
			var transition = graph.getCell(id);
			transitions.push(transition);
		}
	}
	
	transitions.forEach(function(t) {		
		t.attr('.label/fill', '#25A4C2');
		
		t.attr('.root/fill', '#25A4C2');
		t.attr('.root/stroke', '#25A4C2');
	});
}



function stopSimulation(simulationId) {
	clearInterval(simulationId);
}

//var simulationId = simulate();




//The root URL for the RESTful services
//var rootURL = "http://localhost:8080/WACel";
var rootURL = "..";
/*
@T�tulo: Consultar dados de um cen�rio para gerar o Petri-Net
@Objetivo: Popular a p�gina de exibi��o de um modelo de Petri-Net do cen�rio.
@Contexto:
	- Localiza��o: camada de vis�o.
	- Pr�-condi��o: EXIBIR AS INFORMA��ES DO CEN�RIO
@Atores: sistema
@Recursos: id do cen�rio.
 */
function show_petri_net(scenario_id){
	var jsonNodes = [];
	var jsonEdges = [];	
	var jsonGroupNodes = []; //Nodes that group related nodes
	
	
	//Save transitions for firing
	var jsonTransitionsHappyPath = [];

	var num_nodes = 0;
	var num_arcs = 0;
	var root_node = '';

//	@Epis�dio 1: Monta requisi��o ajax e CONTROLE CONSULTA DADOS DO CEN�RIO	
	$.ajax({
		type: "GET",
		url: rootURL + "/petriNet/scenario/" + scenario_id,
		dataType: "json", // data type of response
		success: function(data){
			var has_petrinet = false;

			// get petri net
			var id_pn = data.id;
			var name_pn = data.name;
			var pnml = data.pnml;
			
			// get analysis
			var pathToDeadlock = data.pathToDeadlock;
			var nonDeterminismTransitions = data.nonDeterminismTransitions;
			var placesToOverflow = data.placesToOverflow;
			var neverEnabledTransitions = data.neverEnabledTransitions;
					

			// JAX-RS serializes an empty list as null, and a 'collection of one' as an object (not an 'array of one')
			var list_nodes = data.nodes == null ? [] : (data.nodes instanceof Array ? data.nodes : [data.nodes]);
			num_nodes = list_nodes.length;
			$.each(list_nodes, function(index, node) {
				petrinet = true;
				var id_node = node.id;
				var name_node = node.name;
				var label_node = node.label;
				var type_node = node.type;
				var orientation_node = node.orientation;
				
				var pos_x_node = node.positionX;
				var pos_y_node = node.positionY;
				
				var tokens_node = node.tokens;

				if (type_node == "PLACE" || type_node == "PLACE_WITH_TOKEN"){
					var place = createPlace(id_node, name_node, pos_x_node, pos_y_node, tokens_node);
					jsonNodes.push(place);
					
				}	
				
				else if (type_node == "TRANSITION" || type_node == "TRANSITION_ALTERNATIVE"  || type_node == "TRANSITION_ELSE"  || type_node == "TRANSITION_DO_WHILE") {
					var transition = createTransition(id_node, name_node, pos_x_node, pos_y_node, orientation_node);
					jsonNodes.push(transition);
					if (type_node == "TRANSITION")
						jsonTransitionsHappyPath.push(transition);
					
				}

			});

			// JAX-RS serializes an empty list as null, and a 'collection of one' as an object (not an 'array of one')
			var list_arcs = data.arcs == null ? [] : (data.arcs instanceof Array ? data.arcs : [data.arcs]);
			num_arcs = list_arcs.length;
			$.each(list_arcs, function(index, arc) {
				var id_edge = arc.id;
				var id_source = arc.source.id;
				var id_target = arc.target.id;

				var source = findNodeById(id_source, jsonNodes);
				var target = findNodeById(id_target, jsonNodes);
					
				jsonEdges.push(linkById(id_source, id_target));
				
				
			});
			
			//Draw Petri Net: Places and trasitions and Arcs
			graph.addCell(jsonNodes);
			graph.addCell(jsonEdges);	
			
			//Update paper height
			//paper.scaleContentToFit();
			
			
			// Start file download.
			document.getElementById("dwnBtnPN").addEventListener("click", function(){
			    // Generate download of pn_<name>.pnml file with some content
			    var text = pnml;
			    var filename = "pn_" +name_pn.split(' ').join('_') + ".pnml";
			    
			    download(filename, text);
			}, false);
			
			// Simulate Petri Net.
			document.getElementById("simBtnPN").addEventListener("click", function(){
				simulationId = simulateHappyPath(jsonTransitionsHappyPath);
			}, false);
			
			// Simulate Petri Net Overflow.
			document.getElementById("overBtnPN").addEventListener("click", function(){
				simulationId = simulateOverflow(placesToOverflow);
			}, false);
			
			// Simulate Petri Net Deadlock.
			document.getElementById("deadBtnPN").addEventListener("click", function(){
				
				simulationId = simulateDeadlock(pathToDeadlock);
			}, false);
			
			// Simulate Petri Net Never Enabled Transitions.
			document.getElementById("neverBtnPN").addEventListener("click", function(){
				simulationId = simulateNeverEnabledTransitions(neverEnabledTransitions);
			}, false);
			
			// Simulate Petri Net Non-deterministic situation.
			document.getElementById("nondetBtnPN").addEventListener("click", function(){
				simulationId = simulateNonDeterminism(nonDeterminismTransitions);
			}, false);

		},
		
		error: function(msg){
			alert( "Erro no ajax ao gerar a petri-net");
		}
	});
		
}

/*
@T�tulo: Consultar dados de um cen�rio para gerar o Petri-Net do cen'ario principal e seus relacionamentos-nao-sequenciais
@Objetivo: Popular a p�gina de exibi��o de um modelo de Petri-Net do cen�rio.
@Contexto:
	- Localiza��o: camada de vis�o.
	- Pr�-condi��o: EXIBIR AS INFORMA��ES DO CEN�RIO
@Atores: sistema
@Recursos: id do cen�rio.
 */
function show_integrated_petri_net(project_id, scenario_id){
	var jsonNodes = [];
	var jsonEdges = [];	

	var jsonGroupNodes = []; //Nodes that group related nodes
	
	//Save transitions for firing
	var jsonTransitionsHappyPath = [];


	var num_nodes = 0;
	var num_arcs = 0;
	var root_nodes = '';

//	@Epis�dio 1: Monta requisi��o ajax e CONTROLE CONSULTA DADOS DO CEN�RIO	
	$.ajax({
		type: "GET",
		url: rootURL + "/petriNet/integrated/project/"+project_id+"/scenario/" + scenario_id,
		dataType: "json", // data type of response
		success: function(data){
			var has_petrinet = false;

			// get petri net
			var id_pn = data.id;
			var name_pn = data.name;
			
			var pnml = data.pnml;
			
			// get analysis
			var pathToDeadlock = data.pathToDeadlock;
			var nonDeterminismTransitions = data.nonDeterminismTransitions;
			var placesToOverflow = data.placesToOverflow;
			var neverEnabledTransitions = data.neverEnabledTransitions;
									
			// JAX-RS serializes an empty list as null, and a 'collection of one' as an object (not an 'array of one')
			var list_nodes = data.nodes == null ? [] : (data.nodes instanceof Array ? data.nodes : [data.nodes]);
			num_nodes = list_nodes.length;
			$.each(list_nodes, function(index, node) {
				var id_node = node.id;
				var name_node = node.name;
				var label_node = node.label;
				var type_node = node.type;
				var orientation_node = node.orientation;
				
				var pos_x_node = node.positionX;
				var pos_y_node = node.positionY;
												
				var tokens_node = node.tokens;
				
				var group_name = node.groupName;
				group_name = group_name.trim();
				
				//Add groups of petri nets
				if ((typeof(group_name) != undefined || group_name != null || group_name != "") && group_name.length > 0) {
					//find existing node-group
					if(!findNodeById(group_name, jsonGroupNodes)) {
						var group = createGroup(group_name, group_name, pos_x_node, pos_y_node, false);
						jsonGroupNodes.push(group);						
					}
				} else {
					//find existing node-group
					if(!findNodeById(name_pn, jsonGroupNodes)) {
						var group = createGroup(name_pn, name_pn, pos_x_node, pos_y_node, true, 0, 0);
						jsonGroupNodes.push(group);						
					}
				}

				if (type_node == "PLACE" || type_node == "PLACE_WITH_TOKEN"){
					var place = createPlace(id_node, name_node, pos_x_node, pos_y_node, tokens_node);
					jsonNodes.push(place);
					//Add place to corresponding group
					if ((typeof(group_name) != undefined || group_name != null || group_name != "") && group_name.length > 0) {
						var group = findNodeById(group_name, jsonGroupNodes);
						group.embed(place);
						//Update size of group
						var new_width = pos_x_node - group.get('position').x;
						var new_height = pos_y_node - group.get('position').y;
						
						if(new_width > group.get('size').width) {
							group = updateGroupSize(group, new_width , group.get('size').height, jsonGroupNodes);							
						}
						if(new_height > group.get('size').height) {
							group = updateGroupSize(group, group.get('size').width , new_height, jsonGroupNodes);							
						}
					} else { //main group
						
					}
					
				} else if (type_node == "TRANSITION" || type_node == "TRANSITION_ALTERNATIVE"  || type_node == "TRANSITION_ELSE"  || type_node == "TRANSITION_DO_WHILE") {
					var transition = createTransition(id_node, name_node, pos_x_node, pos_y_node, orientation_node);
					jsonNodes.push(transition);
					if (type_node == "TRANSITION")
						jsonTransitionsHappyPath.push(transition);
					//Add transition to corresponding group
					if ((typeof(group_name) != undefined || group_name != null || group_name != "") && group_name.length > 0) {
						var group = findNodeById(group_name, jsonGroupNodes);
						group.embed(transition);
						//Update size of group
						var new_width = pos_x_node - group.get('position').x;
						var new_height = pos_y_node - group.get('position').y;
						
						if(new_width > group.get('size').width) {
							group = updateGroupSize(group, new_width , group.get('size').height, jsonGroupNodes);							
						}
						if(new_height > group.get('size').height) {
							group = updateGroupSize(group, group.get('size').width , new_height, jsonGroupNodes);							
						}
					}else { //main group
						
					}
					
				}

			});
			
			//Concatenate nodes and group-nodes
			jsonNodes = jsonGroupNodes.concat(jsonNodes);
			
			// JAX-RS serializes an empty list as null, and a 'collection of one' as an object (not an 'array of one')
			var list_arcs = data.arcs == null ? [] : (data.arcs instanceof Array ? data.arcs : [data.arcs]);
			num_arcs = list_arcs.length;
			$.each(list_arcs, function(index, arc) {
				var id_edge = arc.id;
				var id_source = arc.source.id;
				var id_target = arc.target.id;

				var source = findNodeById(id_source, jsonNodes);
				var target = findNodeById(id_target, jsonNodes);
					
				jsonEdges.push(linkById(id_source, id_target));

			});

			//Draw Petri Net: Places and trasitions and Arcs
			graph.addCell(jsonNodes);
			graph.addCell(jsonEdges);	
			
			//Update paper height
			//paper.scaleContentToFit();
			
			// Start file download.
			document.getElementById("dwnBtnPN").addEventListener("click", function(){
			    // Generate download of integrated_pn_<name>.pnml file with some content
			    var text = pnml;
			    var filename = "integrated_pn_" +name_pn.split(' ').join('_') + ".pnml";
			    
			    download(filename, text);
			}, false);
			
			// Simulate Petri Net.
			document.getElementById("simBtnPN").addEventListener("click", function(){
				simulationId = simulateHappyPath(jsonTransitionsHappyPath);
			}, false);
			
			// Simulate Petri Net Overflow.
			document.getElementById("overBtnPN").addEventListener("click", function(){
				simulationId = simulateOverflow(placesToOverflow);
			}, false);
			
			// Simulate Petri Net Deadlock.
			document.getElementById("deadBtnPN").addEventListener("click", function(){
				simulationId = simulateDeadlock(pathToDeadlock);
			}, false);
			
			// Simulate Petri Net Never Enabled Transitions.
			document.getElementById("neverBtnPN").addEventListener("click", function(){
				simulationId = simulateNeverEnabledTransitions(neverEnabledTransitions);
			}, false);
			
			// Simulate Petri Net Non-deterministic situation.
			document.getElementById("nondetBtnPN").addEventListener("click", function(){
				simulationId = simulateNonDeterminism(nonDeterminismTransitions);
			}, false);

		},

		error: function(msg){
			alert( "Erro no ajax ao gerar a petri-net: ");
		}
	});
}

/*
 * HTML5
 * https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
 */
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}