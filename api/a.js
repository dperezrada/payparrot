parrot = db.parrots.findOne();
suscription = db.suscriptions.findOne();
for(var i = 0; i<19; i++){
        delete parrot['_id'];
	a = ["daniel", "juan", "guillermo"];
	parrot.twitter_info.screen_name = a[Math.floor(Math.random()*3)]
        db.parrots.save(parrot);
        delete suscription['_id'];
        suscription['parrot_id'] = parrot._id;
        var tmp_date = new Date(suscription['created_at'].getFullYear(),suscription['created_at'].getMonth(),suscription['created_at'].getDate()+1);
        suscription['created_at'] = tmp_date;
        db.suscriptions.insert(suscription);
}
