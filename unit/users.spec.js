const mongoose = require('mongoose');
const factory = require('../factories/systemFactory');
const User = mongoose.model('Users');
//const Celestial = mongoose.model('Celestial');

process.env.TEST_SUITE = 'spacetime-systems-test';

describe('Users', () => {
    beforeEach(() => {
        User.ensureIndexes({ loc: '2d' });
    });
    describe('CREATE', () => {
        let users;
        beforeEach(async() => {
            users = await factory.makeSystems(50);
        });
        test('can create a system', async() => {
            await new User({
                email: 'marjorie@gmail.com',
                password: '123456',
                roles: { admin: false },
            }).save();
            const findedUser = await User.findOne({ email: 'marjorie@gmail.com' });
            expect(findedUser.email).toEqual('Sol');
        });
        test('can create random systems', async() => {
            const fetchedSystems = await System.find({});

            expect(fetchedSystems.length).toEqual(50);
        });
    });
    /*   describe('READ', () => {
        let systems;

        beforeEach(async () => {
          systems = await factory.makeSystems(50);
        });
        test('target system can find nearest system to it', async () => {
          const nearest = await systems[0].findClosest();

          expect(systems.map(system => system.name)).toContain(nearest.name);
        });
        test('target system can find nearest systems within specified range', async () => {
          const noSystems = await systems[0].findWithinRange(0);
          const someSystems = await systems[0].findWithinRange(50);

          expect(systems.length).toEqual(50);
          expect(noSystems.length).toEqual(0);
          expect(someSystems.length).toBeGreaterThan(0);
          expect(someSystems.length).toBeLessThan(50);
        });
      }); */
    /*   describe('DELETE', () => {
        let systems;

        beforeEach(async () => {
          const newSystems = await factory.makeSystems(2);
          await Promise.all(newSystems.map(system => system.addCelestials(5)));
          systems = await System.find({});
        });
        test('should delete system and associated celestials', async () => {
          await systems[0].remove();
          const remainingSystems = await System.find({});
          const remainingCelestials = await Celestial.find({});

          expect(remainingSystems.length).toEqual(1);
          expect(remainingCelestials.length).toEqual(5);
        });
      }); */
});