/**
* @author Nhu Nguyen & David Chicas
* @year 2022 
*/

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
const { Song } = require('../model/song.js');
const adminToken = 'test-admin-token-0123456789abcdef';
process.env.ADMIN_API_TOKEN = adminToken;
let server = require('../app').app;
let should = chai.should();

chai.use(chaiHttp);

describe('Songs', () => {
    /*
     * Test the /POST route
     */
    describe('/POST song', () => {
        it('rejects song creation without an admin token', function (done) {
            chai.request(server)
                .post('/song')
                .send({ track_id: 'unauthorized' })
                .end((err, res) => {
                    if (err) { return done(err); }
                    res.should.have.status(401);
                    done();
                });
        });

        it('POST a song with info', function (done) {
            let song = new Song();
            song.track_id = '123456789';
            song.track_name = 'Test Song';
            song.playlist_genre = "test genre";
            song.playlist_subgenre = "test subgenre";
            song.duration_ms = "123456";
            // console.log(song);
            chai.request(server)
                .post('/song')
                .set('x-admin-token', adminToken)
                .send(song)
                .end((err, res) => {
                    if (err) { done(err) }
                    console.log(res.body.success);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    done();
                });
        });

    });

    /*
     * Test the /DELETE/:id route
     */
    describe('/DELETE/:id song', () => {
        it('rejects song deletion without an admin token', function (done) {
            chai.request(server)
                .delete('/song/unauthorized')
                .end((err, res) => {
                    if (err) { return done(err); }
                    res.should.have.status(401);
                    done();
                });
        });

        it('DELETE song by the given track ID', function (done) {
            let track_id = '123456789';
            chai.request(server)
                .delete('/song/' + track_id)
                .set('x-admin-token', adminToken)
                .end((err, res) => {
                    if (err) { done(err) }
                    console.log(res.body.success);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    done();
                });
        });
    });

    /*
     * Test the /GET song route
     */
    describe('/GET all songs', () => {
        it('GET all the songs', (done) => {
            chai.request(server)
                .get('/song')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.at.least(70000);
                    done();
                });
        });
    });

    /*
     * Test the /GET song/:id route
     */
    describe('/GET song with id', () => {
        it('GET song with the given track ID', function (done) {
            let track_id = 'spotify:track:6f807x0ima9a1j3VPbc7VN';
            chai.request(server)
                .get('/song/' + track_id)
                .end((err, res) => {
                    if (err) { done(err) }
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('track_id');
                    res.body.should.have.property('track_name');
                    res.body.should.have.property('track_artist');
                    res.body.should.have.property('playlist_name');
                    done();
                });

        });
    });
    /*
     * Test the /GET song/genre/:playlist_genre route
     */
    describe('/GET all songs with genre', () => {
        it('GET all the songs with the given genre', function (done) {
            let playlist_genre = 'pop';
            chai.request(server)
                .get('/song/genre/' + playlist_genre)
                .end((err, res) => {
                    if (err) { done(err) }
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.at.least(10000);
                    done();
                });

        });
    });

    /*
     * Test the /GET song/subgenre/:playlist_subgenre route
     */
    describe('/GET all songs with subgenre', () => {
        it('GET all the songs with the given subgenre', function (done) {
            let playlist_subgenre = 'dance pop';
            chai.request(server)
                .get('/song/subgenre/' + playlist_subgenre)
                .end((err, res) => {
                    if (err) { done(err) }
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.at.least(5000);
                    done();
                });

        });

    });

});