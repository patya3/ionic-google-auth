import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { Idea, IdeaService } from '../services/idea.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  ideas: Observable<Idea[]>;
  idea: Idea = {
    name: '',
    notes: ''
  };
  id = null;

  constructor(
    private ideaService: IdeaService,
    public auth: AuthService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.ideas = this.ideaService.getIdeas();
  }

  addIdea() {
    this.ideaService.addIdea(this.idea).then(
      () => {
        this.showToast('Successfully added');
      },
      err => this.showToast('There was a problem try again')
    );
  }

  updateIdea() {
    this.ideaService.updateIdea(this.idea).then(
      () => {
        this.showToast('Successfully updated');
      },
      err => this.showToast('There was a problem try again')
    );
  }

  onSelectIdea(idea: Idea) {
    this.idea = idea;
  }

  private showToast(msg: string) {
    this.toastCtrl
      .create({ message: msg, duration: 2000 })
      .then(toast => toast.present());
  }

  public copyObject(object) {
    return { ...object };
  }
}
