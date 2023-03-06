import insertData from '@salesforce/apex/TeamsAppController.insertData';
import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getTeams from '@salesforce/apex/TeamsAppController.getTeams';

export default class MemberSkills extends LightningElement {
    name;
    team;
    skills;
    loading = false;
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
    }

    handleClick(event) {
        let name = this.template.querySelector('.name').value;
        let skills = this.template.querySelector('.skills').value;
        let inputFields = [...this.template.querySelectorAll('lightning-input'), this.template.querySelector('lightning-combobox')]
            .reduce((validSoFar, inputField) => {
                inputField.reportValidity();
                return validSoFar && inputField.checkValidity();
            }, true);
        if (inputFields) {
            this.loading = true;
            insertData({ name: name, skills: skills, teamId: this.team })
                .then(result => {
                    const event = new ShowToastEvent({
                        title: 'Success',
                        message: 'Team Member has been added Successfully',
                        variant: 'Success',
                        mode: 'dismissable'
                    });
                    this.dispatchEvent(event);
                    this.name = '';
                    this.skills = '';
                    this.team = '';
                    this.loading = false;
                })
                .catch((error) => {
                    console.log(JSON.stringify(error));
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error creating record',
                            message: error.body.message,
                            variant: 'error'
                        })
                    );
                    this.loading = false;
                })
            //this.loading = false;
        }
    }
}