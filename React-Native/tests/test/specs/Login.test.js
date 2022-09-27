let expect = require('chai').expect;

describe('Login flow testing', () => {

  beforeEach(() => {
    $("~app-root").waitForDisplayed(10000, false)
  });

  it('Login test: valid case', async () => {

    await $('~user-avatar').click();
    await $('~Login').click();
    await $('~by-email').click();
    await $('~your-email').setValue('mykhailo001@outlook.com');
    await $('~send-me-code').click();
    await $('~user-avatar').click();

    $('~user-name').waitForDisplayed(5000);
    const status = await $('~user-name').getText();
    expect(status).to.equal('Mykhailo');
  });

  /*
  it('Login test: invalid case', async () => {

    await $('~user-avatar').click();
    await $('~Login').click();
    await $('~by-email').click();
    await $('~your-email').setValue('demo@kuky.com');
    await $('~send-me-code').click();

    $('~user-name').waitForDisplayed(5000);
    const status = await $('~user-name').getText();
    expect(status).to.equal('Guest');
  });
  */
});