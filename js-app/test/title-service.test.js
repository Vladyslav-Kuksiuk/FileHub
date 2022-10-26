import {TitleService} from '../src/title-service';

describe('Title service', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test(`Should render title`, function(done) {
    expect.assertions(1);

    const mainTitle = 'myTitle';
    const separator = ' - '
    const titles =  ['title1', 'title2']
    const titleService = new TitleService(mainTitle, separator);

    titleService.titles = titles;

    setTimeout(()=>{
      expect(document.title).toBe(mainTitle+separator+titles[0]+separator+titles[1]);
      done()
    })
  });
});
