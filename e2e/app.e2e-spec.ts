import { NeuroCanvasFrontPage } from './app.po';

describe('neuro-canvas-front App', () => {
  let page: NeuroCanvasFrontPage;

  beforeEach(() => {
    page = new NeuroCanvasFrontPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
