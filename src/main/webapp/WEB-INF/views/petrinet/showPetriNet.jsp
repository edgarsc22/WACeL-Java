<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ page isELIgnored="false" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<html>

<head>
	
	<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Petri-Net</title>
	
	
		<script src="<c:url value='/assets/js/jquery/jquery.min.js' />" ></script>
		
	
		<!-- APP -->
		<script src="<c:url value='/assets/js/app/ajax_functions.js' />" ></script>
		
				
		<!-- importar libs para visualizacao de grafos - Joint JS -->
		<link href="<c:url value='/assets/css/joint/joint.css' />" rel="stylesheet"></link>
		<link href="<c:url value='/assets/css/joint/shapes.devs.css' />" rel="stylesheet"></link>
		
		<script src="https://cdn.jsdelivr.net/npm/fake-smile@1.0.1/smil.user.min.js"></script>
        <!--  <script src="src/jquery/jquery.js"></script> --> 
        <script src="<c:url value='/assets/js/lodash/lodash.js' />" ></script>
        <script src="<c:url value='/assets/js/backbone/backbone.js' />" ></script>
		<script src="<c:url value='/assets/js/joint/joint.js' />" ></script>
				
		<script type="text/javascript">

			$(document).ready(function(){
				var scenario = document.getElementById("scenarioId");
				var selectedScenarioId = scenario.value;
				show_petri_net(selectedScenarioId);
			});
		</script>
	<title>Gerando Petri-Nets do Cen&aacute;rio</title>
    </head>
    <body>
		
        <input type="hidden" id="scenarioId" name="scenarioId" value=${scenarioId}>
        <table width=457>
			<tr>
				<td align="left"><span align="left" class="pes"><fmt:message key="petrinet.show.form.scenario.title"> </fmt:message></span></td>
			</tr>
			<tr>
				<td align="left">
					<input type="button" id="dwnBtnPN" value='<fmt:message key="petrinet.show.form.download"> </fmt:message>'/>
				</td>
			</tr>
		</table>

		
		<div id="cy" style="border:2px solid; z-index: 100; overflow:auto; overflow-x: scroll ; overflow-y: scroll;"></div>
		
		<!-- APP: Draw Petri Net-->
		<script src="<c:url value='/assets/js/app/ajax_functions_petri_nets_joint.js' />" ></script>				
		
        <div align=left bgcolor="#ffffff">
    
    </body>
</html>
