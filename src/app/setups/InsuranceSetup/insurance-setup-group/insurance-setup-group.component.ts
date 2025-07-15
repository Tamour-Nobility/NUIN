import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ListInsGroupSetupComponent } from './list-ins-group-setup/list-ins-group-setup.component';

@Component({
  selector: 'app-insurance-setup-group',
  templateUrl: './insurance-setup-group.component.html'
})
export class InsuranceSetupGroupComponent implements OnInit {
  @ViewChild('addEditGroupModal') addEditGroupModal: ModalDirective;
  @ViewChild(ListInsGroupSetupComponent) listInsGroupSetup!: ListInsGroupSetupComponent;

  modalTitle: string = '';
  selectedGroupId: number | null = null;

  constructor() {}

  ngOnInit(): void {}

  // Open Modal for Add/Edit
  openModal(title: string, groupId: number | null = null): void {
    this.modalTitle = title;
    this.selectedGroupId = groupId;
    this.addEditGroupModal.show();
  }

  // Close Modal
  closeModal(): void {
    this.addEditGroupModal.hide();
  }

  // Handle Save Event
  onSaveGroup(updatedData: any): void {
    console.log('Group saved successfully:', updatedData);
    this.closeModal();
    debugger
    if (this.listInsGroupSetup) {
      this.listInsGroupSetup.GetGroupsList();
    }
    // Optionally, refresh the grid or perform further actions.
  }
}
