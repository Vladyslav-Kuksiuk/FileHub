import {TitleService} from '../src/application-components/title-service';

describe('Title service', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test(`Should render title`, function() {
    expect.assertions(1);

    const mainTitle = 'myTitle';
    const separator = ' - ';
    const titles = ['title1', 'title2'];
    const titleService = new TitleService(mainTitle, separator);

    titleService.setTitles(titles);

    expect(document.title).toBe(mainTitle+separator+titles[0]+separator+titles[1]);
  });
});
