import {jest} from '@jest/globals';
import {Observer} from '../../src/components/mutation-observer';

describe('MutationObserver', () => {
  test(`Should add removing handlers and trigger them`, function() {
    expect.assertions(3);

    document.body.innerHTML = `
        <div id="div-1">
            <div id="div-2">
                <div id="div-3"></div>
            </div>
        </div>
        `;

    const div1Handler = jest.fn();
    const div2Handler = jest.fn();
    const div3Handler = jest.fn();

    Observer.observe(document.querySelector('[id="div-1"]'), div1Handler);
    Observer.observe(document.querySelector('[id="div-2"]'), div2Handler);
    Observer.observe(document.querySelector('[id="div-3"]'), div3Handler);

    document.body.innerHTML = '';

    return Promise.resolve().then(()=>{
      expect(div1Handler).toHaveBeenCalledTimes(1);
      expect(div2Handler).toHaveBeenCalledTimes(1);
      expect(div3Handler).toHaveBeenCalledTimes(1);
    });
  });
});
