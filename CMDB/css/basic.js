var showActionsButton = document.querySelector('#showactions');
var hideActionsButton = document.querySelector('#hideactions');
var actionPaneShow = document.querySelector('.action-pane__show');
var actionPaneHide = document.querySelector('.action-pane__hide');
var actionPaneContent = document.querySelector('.action-pane__content');

showActionsButton.addEventListener('click', function () {
    actionPaneHide.classList.add('action-pane__visible');
    actionPaneHide.classList.remove('action-pane__hidden');
    actionPaneShow.classList.add('action-pane__hidden');
    actionPaneShow.classList.remove('action-pane__visible');
    actionPaneContent.classList.add('action-pane__visible');
    actionPaneContent.classList.remove('action-pane__hidden');
});

hideActionsButton.addEventListener('click', function () {
    actionPaneHide.classList.add('action-pane__hidden');
    actionPaneHide.classList.remove('action-pane__visible');
    actionPaneShow.classList.add('action-pane__visible');
    actionPaneShow.classList.remove('action-pane__hidden');
    actionPaneContent.classList.add('action-pane__hidden');
    actionPaneContent.classList.remove('action-pane__visible');
});
