package pe.edu.unsa.daisi.lis.cel.domain.factory;

import java.util.List;

import pe.edu.unsa.daisi.lis.cel.domain.model.analysis.Defect;

public class NewDefect {
	
	public static Defect buildDefect(Long scenarioId, String scenarioElement, String scenarioElementId, String qualityProperty, 
			String indicatorTemplate, String indicatorSentence, String indicator, 
			String defectCategory, String fixRecomendation) {
		
		Defect defect = new Defect();
		defect.setQualityProperty(qualityProperty);
		defect.setScenarioId(scenarioId);
		defect.setScenarioElement(scenarioElement);
		//Set the scenario element ID, e.g. episode id, alternative id 
		if(scenarioElementId != null)
			defect.setScenarioElement(defect.getScenarioElement().replace("<id>", scenarioElementId));
		
		defect.setIndicator(indicatorTemplate);
		//Set the sentence with a defect indicator. Set the specific indicator
		if(indicatorSentence != null)
			defect.setIndicator(defect.getIndicator().replace("<sentence>", indicatorSentence));
		if(indicator != null)
			defect.setIndicator(defect.getIndicator().replace("<indicator>", indicator));
		
		defect.setDefectCategory(defectCategory);		
		defect.setFixRecomendation(fixRecomendation);		
		
		return defect;
	}
	
	/**
	 * @param scenarioId
	 * @param scenarioElement
	 * @param scenarioElementId
	 * @param qualityProperty
	 * @param indicatorTemplate
	 * @param indicatorSentence
	 * @param indicators set of indicators
	 * @param defectCategory
	 * @param fixRecomendation
	 * @return
	 */
	public static Defect buildDefectWithIndicators(Long scenarioId, String scenarioElement, String scenarioElementId, String qualityProperty, 
			String indicatorTemplate, String indicatorSentence, List<String> indicators, 
			String defectCategory, String fixRecomendation) {
		
		Defect defect = new Defect();
		defect.setQualityProperty(qualityProperty);
		defect.setScenarioId(scenarioId);
		defect.setScenarioElement(scenarioElement);
		//Set the scenario element ID, e.g. episode id, alternative id 
		if(scenarioElementId != null)
			defect.setScenarioElement(defect.getScenarioElement().replace("<id>", scenarioElementId));
		
		defect.setIndicator(indicatorTemplate);
		//Set the sentence with a defect indicator. Set the specific indicator
		if(indicatorSentence != null)
			defect.setIndicator(defect.getIndicator().replace("<sentence>", indicatorSentence));
		if(indicators != null)
			for(String indicator: indicators)
				defect.setIndicator(defect.getIndicator().replaceFirst("<indicator>", indicator));
		
		defect.setDefectCategory(defectCategory);		
		defect.setFixRecomendation(fixRecomendation);		
		
		return defect;
	}
}
