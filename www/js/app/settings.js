var TalentSearch = TalentSearch || {};

TalentSearch.Settings = TalentSearch.Settings || {};
TalentSearch.Settings.BaseURL = "http://localhost:8080/accenture-campus-placement/"

TalentSearch.Settings.signInUrl = TalentSearch.Settings.BaseURL+"login";
TalentSearch.Settings.addVenueUrl = TalentSearch.Settings.BaseURL+"venueDetail/add";
TalentSearch.Settings.addUserUrl = TalentSearch.Settings.BaseURL+"user/add";
TalentSearch.Settings.addPanelUrl = TalentSearch.Settings.BaseURL+"selectionPanelDetail/add";
TalentSearch.Settings.addSelectionUrl = TalentSearch.Settings.BaseURL+"selectionDetail/add";
TalentSearch.Settings.loadVenuesUrl = TalentSearch.Settings.BaseURL+"venueDetails";
TalentSearch.Settings.loadPanelsUrl = TalentSearch.Settings.BaseURL+"selectionPanelDetails";
TalentSearch.Settings.loadSelectionsUrl = TalentSearch.Settings.BaseURL+"selectionDetails";
TalentSearch.Settings.loadUserUrl = TalentSearch.Settings.BaseURL+"users";  
 
TalentSearch.Settings.sessionTimeoutInMSec = 600000
