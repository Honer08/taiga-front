import {Component, OnDestroy} from "@angular/core";
import {Store} from "@ngrx/store";
import {IState} from "../../../../app.store";
import {Observable, Subscription} from "rxjs";
import * as Immutable from "immutable";

@Component({
    template: require("./permissions.pug")(),
})
export class AdminPermissionsPage implements OnDestroy {
    project: Observable<Immutable.Map<string, any>>;
    currentRole: Immutable.Map<string, any> = null;
    noEstimableRoles: boolean;
    subscriptions: Subscription[];

    constructor(private store: Store<IState>) {
        this.project = this.store.select((state) => state.getIn(['projects', 'current-project']));

        this.subscriptions = [
            this.project.subscribe((project) => {
                if (project) {
                    this.currentRole = project.getIn(['roles', 0]);
                    this.noEstimableRoles = !project.get('roles').some((role) => role.get('computable'));
                }
            })
        ]
    }

    ngOnDestroy() {
        for (let subscription of this.subscriptions) {
            subscription.unsubscribe()
        }
    }
}