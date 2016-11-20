import { NotesA2Page } from './app.po';

describe('notes-a2 App', function() {
  let page: NotesA2Page;

  beforeEach(() => {
    page = new NotesA2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
