public with sharing class TeamsAppController {
    
    @AuraEnabled(cacheable=true)
    public static List<Team__c> getTeams(){
        try {
            return [SELECT Id, Name from Team__c];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void insertData(String name, String skills, Id teamId){
        try {
            Team_Member__c tMember = new Team_Member__c(Name = name, Team__c = teamId, Skills__c = skills);
            insert tMember;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<Team_Member__c> getTeamMembersData(Id teamId){
        return [SELECT Id, Name, Team__r.Name, Skills__c FROM Team_Member__c where Team__c = :teamId];
    }

}