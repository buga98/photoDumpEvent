PHOTO DUMP EVENT — INTERAKTIVNI TUTORIJAL V2

Promjene u profesionalnoj doradi:
- tekstualna kartica je uvijek u prvom planu i više je ne zatamnjuje spotlight
- spotlight je izveden s četiri odvojena zatamnjena područja, bez ogromnog box-shadowa
- kartica je stabilno postavljena iznad donje navigacije
- korak s posvetom uklonjen je iz tutorijala jer posveta nije obavezna
- nakon stvarno dovršenog uploada tutorijal automatski prelazi na "Tvoje fotografije"
- tijekom uploada prikazuje se stanje čekanja, bez mogućnosti zabune
- korisnik i dalje može završiti tutorijal u svakom trenutku
- opcija "Kako radi" u bočnom izborniku ponovno pokreće tutorijal
- verzija localStorage ključa podignuta je na v2 radi ponovnog testiranja

Tutorijal ne zapisuje podatke u Firebase i ne mijenja autentikaciju, upload logiku,
Firestore pravila ili Storage pravila. U script.js dodani su samo lokalni CustomEvent
signali za početak/završetak uploada i promjenu ekrana.
