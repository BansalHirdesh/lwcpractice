import { LightningElement, wire } from 'lwc';
import getTeamMembersData from '@salesforce/apex/TeamsAppController.getTeamMembersData';
import getTeams from '@salesforce/apex/TeamsAppController.getTeams';

let i=0;
export default class TeamList extends LightningElement {
    team;
    teamMembers;
    teamList = [];

    @wire(getTeams)
    xyz({ data, error }) {
        if (data) {
            console.log(JSON.stringify(data));
            for (let i = 0; i < data.length; i++) {
                this.teamList.push({ value: data[i].Id, label: data[i].Name });
            }
            this.teamList = [...this.teamList];
        }
        else {
            console.log(error);
        }
    };

    get teamsOptionsList() {
        return this.teamList;
    }

    handleChange(event) {
        this.team = event.detail.value;
        getTeamMembersData({teamId : this.team})
        .then(result => {
            this.teamMembers = result;
        })
        .catch(error => {
            alert(error.message);
        })
    }

}