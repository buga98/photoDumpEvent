(function PhotoDumpI18n() {
  "use strict";
  const LANGUAGES = {
    hr: { code: "HR", label: "Hrvatski", flag: "/assets/lang/hr.png" },
    en: { code: "EN", label: "English", flag: "/assets/lang/en.svg" },
    de: { code: "DE", label: "Deutsch", flag: "/assets/lang/de.svg" }
  };
  const TRANSLATIONS = { en: {"Najnovije":"Newest","Najpopularnije":"Most popular","Najstarije":"Oldest","Prikaz":"View","Feed":"Feed","Grid":"Grid","Još nema fotografija 📸":"No photos yet 📸","Kako radi": "How it works", "Mogućnosti": "Features", "Paketi": "Packages", "Kontakt": "Contact", "Instaliraj": "Install", "Instaliraj aplikaciju": "Install app", "Organizatori": "Organizers", "Prijava organizatora": "Organizer login", "Isprobaj demo": "Try the demo", "Otvori demo": "Open demo", "Izbornik": "Menu", "Otvori izbornik": "Open menu", "Zatvori izbornik": "Close menu", "Zatvori": "Close", "Nazad": "Back", "← Nazad": "← Back", "Da": "Yes", "Ne": "No", "Sve": "All", "Svi": "All", "Vidljive": "Visible", "Skrivene": "Hidden", "Aktivni": "Active", "Basic": "Basic", "Standard": "Standard", "Premium": "Premium", "Default": "Default", "Event": "Event", "Učitavanje...": "Loading...", "Učitavam...": "Loading...", "Molim pričekaj...": "Please wait...", "Spremi postavke": "Save settings", "Postavke": "Settings", "⚙️ Postavke": "⚙️ Settings", "Admin pristup": "Admin access", "Ulaz": "Enter", "Unesi lozinku": "Enter password", "Admin šifra": "Admin password", "Kriva šifra": "Wrong password", "Kriva lozinka": "Wrong password", "Nemaš pristup": "Access denied", "Greška kod provjere pristupa": "Access check failed", "Jezik": "Language", "Aplikacija": "App", "Moderator panel": "Moderator panel", "Instalacija na mobitel": "Install on mobile", "PhotoDumpEvent uvijek na početnom zaslonu": "Keep PhotoDumpEvent on your Home Screen", "Dodaj ovaj event na početni zaslon. Sljedeći put otvaraš ga direktno preko ikone, a event i prijavljeno ime ostaju zapamćeni.": "Add this event to your Home Screen. Next time, open it directly from the icon; the event and signed-in name stay saved.", "Za spremanje konkretnog eventa prvo ga otvori preko QR koda ili linka, a zatim dodirni gumb za instalaciju unutar eventa. Tako će ikona uvijek otvarati baš taj event.": "To save a specific event, first open it using its QR code or link, then tap the install button inside the event. The icon will always open that event.", "Aplikacija je već instalirana ✓": "The app is already installed ✓", "Otvori je preko PhotoDumpEvent ikone na početnom zaslonu.": "Open it using the PhotoDumpEvent icon on your Home Screen.", "Za instalaciju na iPhoneu otvori ovu stranicu u Safariju.": "To install on iPhone, open this page in Safari.", "Otvori PhotoDumpEvent u Safari pregledniku.": "Open PhotoDumpEvent in Safari.", "Dodirni ikonu dijeljenja Share.": "Tap the Share icon.", "Odaberi Dodaj na početni zaslon.": "Choose Add to Home Screen.", "Provjeri naziv i dodirni Dodaj.": "Check the name and tap Add.", "Otvori PhotoDumpEvent u Chromeu.": "Open PhotoDumpEvent in Chrome.", "Ako se pojavi poruka, dodirni Instaliraj aplikaciju.": "If prompted, tap Install app.", "Ako se ne pojavi, dodirni izbornik ⋮.": "If it does not appear, tap the ⋮ menu.", "Odaberi Dodaj na početni zaslon ili Instaliraj aplikaciju.": "Choose Add to Home Screen or Install app.", "Instaliraj sada": "Install now", "Nema trgovine aplikacija ni dodatnih preuzimanja. Instalacija traje manje od minute.": "No app store or extra downloads. Installation takes less than a minute.", "PhotoDumpEvent — QR galerija za vjenčanja i evente": "PhotoDumpEvent — QR gallery for weddings and events", "Digitalna galerija koja raste tijekom eventa": "A digital gallery that grows during the event", "Jedan QR kod.": "One QR code.", "Stotine pogleda.": "Hundreds of perspectives.", "Jedna uspomena.": "One shared memory.", "Gosti skeniraju, fotografiraju i dijele trenutke bez instalacije aplikacije. Ti dobivaš jednu živu galeriju, posvete, slideshow i sve uspomene na jednom mjestu.": "Guests scan, take photos and share moments without installing an app. You get one live gallery, messages, a slideshow and every memory in one place.", "Doživi kako radi": "See how it works", "Bez instalacije": "No installation", "QR pristup": "QR access", "Već imaš event?": "Already have an event?", "Upiši ID ili zalijepi cijeli link.": "Enter the ID or paste the full link.", "Event ID ili link": "Event ID or link", "Otvori event": "Open event", "Galerija uspomena": "Memory gallery", "fotki": "photos", "srca": "likes", "Nova fotografija": "New photo", "upravo dodano": "just added", "nova srca": "new likes", "Scrollaj priču": "Scroll through the story", "Od praznog eventa do galerije pune života": "From an empty event to a gallery full of life", "Ne objašnjavamo proizvod.": "We do not just explain the product.", "Pokazujemo kako nastaje.": "We show how it comes to life.", "Prije prvog gosta": "Before the first guest", "Event još nije počeo. Uspomene samo što nisu stigle.": "The event has not started yet. The memories are about to arrive.", "Dobivaš vlastiti link i QR kod, prilagođen naziv, boje i tekstove eventa.": "You get your own link and QR code, with a customized name, colors and event text.", "Jedan pokret kamerom": "One scan away", "Postavi QR kod na stol. Ostalo rade gosti.": "Place the QR code on the table. Guests do the rest.", "Skeniranje otvara event direktno u pregledniku. Nema trgovine aplikacija, registracije ni lozinki.": "Scanning opens the event directly in the browser. No app store, registration or passwords.", "Ulazak u nekoliko sekundi": "Enter in seconds", "Gost upiše ime i odmah je unutra.": "The guest enters a name and is immediately in.", "Sučelje je jasno i ljudima koji aplikaciju vide prvi put. Jedan unos, jedan dodir, gotovo.": "The interface is clear even to first-time users. One entry, one tap, done.", "Trenutak nastaje": "A moment is captured", "Fotograf vidi ceremoniju. Gosti vide sve ostalo.": "The photographer sees the ceremony. Guests see everything else.", "Kamera ili galerija. Fotografija se pripremi, prenese i pojavi u zajedničkom feedu.": "Camera or gallery. The photo is prepared, uploaded and appears in the shared feed.", "Galerija živi": "The gallery comes alive", "Svaki gost vidi drugi trenutak. PhotoDump ih spaja u jednu priču.": "Every guest sees a different moment. PhotoDump brings them together in one story.", "Fotografije stižu tijekom eventa, brojači rastu, a galerija se puni pred očima svih gostiju.": "Photos arrive throughout the event, counters rise and the gallery fills before everyone's eyes.", "Reakcije i posvete": "Reactions and messages", "Nisu spremljene samo fotografije. Spremljene su i riječi.": "It is not only the photos that are saved. The words are saved too.", "Lajkovi, poruke i posvete čuvaju atmosferu večeri, ne samo kadar.": "Likes and messages preserve the atmosphere of the evening, not just the frame.", "Kontrola bez prekidanja zabave": "Control without interrupting the fun", "Vi slavite. Sadržaj je i dalje pod kontrolom.": "You celebrate. The content stays under control.", "Moderator jednim dodirom skriva fotografiju koja ne pripada javnoj galeriji.": "A moderator hides an unsuitable photo with one tap.", "Veliko finale": "The grand finale", "Dok event još traje, uspomene se već prikazuju.": "While the event is still happening, the memories are already on screen.", "Slideshow pretvara fotografije gostiju u živu kulisu na televizoru, projektoru ili velikom ekranu.": "The slideshow turns guest photos into a live backdrop on a TV, projector or large screen.", "Skeniraj za ulaz": "Scan to enter", "Galerija čeka prve uspomene.": "The gallery is waiting for its first memories.", "Dobrodošli": "Welcome", "Podijelite trenutke koje ćemo pamtiti cijeli život.": "Share moments we will remember for a lifetime.", "Uđi u event": "Enter event", "Još samo jedan korak": "Just one more step", "Kako se zoveš?": "What is your name?", "Uđi u galeriju": "Enter the gallery", "Uđi u galeriju 📸": "Enter the gallery 📸", "Bez registracije i instalacije.": "No registration or installation.", "Fotografija dodana": "Photo added", "UŽIVO": "LIVE", "posveta": "messages", "Sakriveno": "Hidden", "Posvete gostiju": "Guest messages", "Riječi koje ostaju.": "Words that remain.", "Želimo vam cijeli život ovakvih osmijeha 🤍": "Wishing you a lifetime of smiles like these 🤍", "Hvala na večeri koju ćemo dugo pamtiti!": "Thank you for an evening we will remember for a long time!", "Najbolji party ove godine 🔥": "The best party of the year 🔥", "TRENUTNO NA EKRANU": "NOW ON SCREEN", "Fotografija gosta": "Guest photo", "Fotografija skrivena": "Photo hidden", "Više nije vidljiva u galeriji": "It is no longer visible in the gallery", "Slideshow uživo": "Live slideshow", "Trenuci koje nitko nije planirao": "The moments nobody planned", "Najbolje fotografije često nastanu": "The best photos are often taken", "kad nitko ne pozira.": "when nobody is posing.", "Upravo dodano": "Just added", "Jedan event": "One event", "Stotine perspektiva": "Hundreds of perspectives", "Jedna zajednička galerija": "One shared gallery", "Jedna aplikacija. Svaki stil.": "One app. Every style.", "Dizajn koji pripada": "A design made for", "baš tom eventu.": "that specific event.", "Vjenčanje": "Wedding", "Krštenje": "Baptism", "Rođendan": "Birthday", "Prva pričest": "First Communion", "Pričest": "Communion", "Svadba": "Wedding", "✨ Krštenje": "✨ Baptism", "💍 Vjenčanje": "💍 Wedding", "Elegantna galerija za trenutke koji se ne ponavljaju.": "An elegant gallery for once-in-a-lifetime moments.", "Boje, tekstovi i atmosfera prilagođeni su mladencima i stilu proslave.": "Colors, text and atmosphere are tailored to the couple and the celebration.", "Nježna digitalna uspomena za obitelj i najbliže.": "A gentle digital keepsake for family and loved ones.", "Svijetla paleta, mirnija atmosfera i prostor za fotografije i posvete cijele obitelji.": "A light palette, a calm atmosphere and space for the whole family's photos and messages.", "Brza, energična galerija koja raste sa svakim beatom.": "A fast, energetic gallery that grows with every beat.", "Neonski detalji, dinamične fotografije i feed koji izgleda kao dio same zabave.": "Neon details, dynamic photos and a feed that feels like part of the party.", "Sve što treba. Ništa što smeta.": "Everything you need. Nothing in the way.", "Gostima jednostavno.": "Simple for guests.", "Organizatoru moćno.": "Powerful for organizers.", "Otvaranje eventa jednim skeniranjem, bez instalacije i registracije.": "Open the event with one scan, without installation or registration.", "Brzi upload": "Fast upload", "Fotografiranje ili odabir više slika iz galerije, direktno s mobitela.": "Take a photo or select multiple images directly from the phone.", "Lajkovi i posvete": "Likes and messages", "Reakcije i poruke pretvaraju galeriju u živu zajedničku priču.": "Reactions and messages turn the gallery into a living shared story.", "Sakrivanje neprimjerenog sadržaja bez prekidanja eventa.": "Hide unsuitable content without interrupting the event.", "Fotografije gostiju prikazuju se na televizoru, projektoru ili LED ekranu.": "Guest photos are displayed on a TV, projector or LED screen.", "Custom dizajn": "Custom design", "Naziv, tekstovi, boje i atmosfera prilagođeni svakom događaju.": "Name, text, colors and atmosphere tailored to every event.", "Od intimne proslave": "From an intimate celebration", "do": "to", "velikog eventa.": "large event.", "Paketi su prilagođeni veličini eventa i potrebama klijenta.": "Packages are tailored to the event size and client needs.", "Na upit": "On request", "Za manje evente i jednostavno prikupljanje fotografija.": "For smaller events and simple photo collection.", "Do 1000 fotografija": "Up to 1,000 photos", "QR link": "QR link", "Galerija, upload i profil": "Gallery, upload and profile", "Osnovna tema događaja": "Basic event theme", "Pošalji upit": "Send inquiry", "Najbolji izbor": "Best choice", "Najbolji omjer mogućnosti i jednostavnosti za većinu evenata.": "The best balance of features and simplicity for most events.", "Do 1500 fotografija": "Up to 1,500 photos", "Originali uključeni": "Original files included", "Za veće evente i dodatni premium dojam tijekom cijele večeri.": "For larger events and an extra premium feel throughout the evening.", "Do 3000 fotografija": "Up to 3,000 photos", "Custom QR kodovi": "Custom QR codes", "Slideshow prikaz": "Slideshow display", "Još samo nekoliko odgovora": "A few quick answers", "Jednostavno od prvog": "Simple from the first", "do zadnjeg skena.": "to the last scan.", "Treba li gost instalirati aplikaciju?": "Does the guest need to install an app?", "Ne. Gost skenira QR kod i otvara event u pregledniku na Androidu ili iPhoneu.": "No. The guest scans the QR code and opens the event in a browser on Android or iPhone.", "Tko može vidjeti fotografije?": "Who can see the photos?", "Fotografije su dostupne preko event linka ili QR koda, a organizator može moderirati sadržaj.": "Photos are available through the event link or QR code, and the organizer can moderate content.", "Mogu li dobiti sve fotografije nakon eventa?": "Can I get all photos after the event?", "Da. Fotografije se nakon eventa mogu pripremiti za preuzimanje prema dogovorenom paketu.": "Yes. After the event, the photos can be prepared for download according to the selected package.", "Radi li na mobitelima?": "Does it work on mobile phones?", "Da. Aplikacija je prvenstveno izrađena za mobitel i radi na Androidu i iPhoneu.": "Yes. The app is designed primarily for mobile and works on Android and iPhone.", "Event traje jednu večer.": "The event lasts one evening.", "Uspomene": "Memories", "ostaju.": "remain.", "Isprobaj aplikaciju iz perspektive gosta ili se javi za termin i ponudu.": "Try the app from a guest's perspective or contact us for availability and an offer.", "Zatraži ponudu": "Request an offer", "Digitalna galerija uspomena za vjenčanja i evente.": "A digital memory gallery for weddings and events.", "Upiši ime i prezime": "Enter your first and last name", "Tvoje ime i prezime": "Your first and last name", "Event nije pronađen. Otvori aplikaciju putem QR koda.": "Event not found. Open the app using the QR code.", "Nema aktivnog eventa": "No active event", "Otvori aplikaciju putem QR koda ili linka eventa.": "Open the app using the event QR code or link.", "Učitavanje eventa...": "Loading event...", "Molimo pričekaj trenutak.": "Please wait a moment.", "Dobrodošli na našu svadbu 💍": "Welcome to our wedding 💍", "Dobrodošli na rođendan 🎂": "Welcome to the birthday party 🎂", "Dobrodošli na krštenje ✨": "Welcome to the baptism ✨", "Dobrodošli na pričest ✝️": "Welcome to the communion ✝️", "Dobrodošli na party 🎉": "Welcome to the party 🎉", "Podijelite uspomene 📸": "Share memories 📸", "Galerija uspomena 🤍": "Memory gallery 🤍", "Svaka fotografija postaje dio uspomena": "Every photo becomes part of the memories", "Podijeli trenutak 📸": "Share a moment 📸", "Dodaj fotografiju i ostavi uspomenu": "Add a photo and leave a memory", "Uhvati trenutak": "Capture a moment", "Odaberi slike": "Choose photos", "Najviše 15 fotografija po odabiru.": "Up to 15 photos per selection.", "Možeš odabrati najviše 15 fotografija odjednom. Prenosit će se prvih 15.": "You can select up to 15 photos at a time. The first 15 will be uploaded.", "Napiši posvetu": "Write a message", "💌 Napiši posvetu": "💌 Write a message", "Napiši posvetu 💌": "Write a message 💌", "Posvetu vide mladenci ili organizator eventa.": "The message is visible to the couple or event organizer.", "Posvete vide mladenci ili organizator eventa.": "Messages are visible to the couple or event organizer.", "Ovdje su tvoje fotografije": "Your photos are shown here", "Tvoje uspomene": "Your memories", "Želite li obrisati sliku?": "Do you want to delete this photo?", "Da, obriši": "Yes, delete", "Napiši lijepu poruku, čestitku ili uspomenu...": "Write a kind message, wish or memory...", "Pošalji posvetu ✉": "Send message ✉", "Odustani": "Cancel", "Fotografije se učitavaju": "Photos are uploading", "Pripremam upload...": "Preparing upload...", "Molimo ne zatvaraj aplikaciju dok upload traje.": "Please do not close the app while the upload is in progress.", "Event je istekao ⏳": "The event has expired ⏳", "Dosegnut je limit fotografija 📸": "The photo limit has been reached 📸", "Event nije pronađen 😕": "Event not found 😕", "Upload završen 🤍": "Upload complete 🤍", "Fotografija nije odabrana 😕": "No photo selected 😕", "Fotografija je obrisana 🗑️": "Photo deleted 🗑️", "Nemaš dozvolu za brisanje ove fotografije 😕": "You do not have permission to delete this photo 😕", "Greška kod brisanja fotografije 😕": "Could not delete the photo 😕", "Napiši poruku 🤍": "Write a message 🤍", "🤍 Hvala na lijepim riječima": "🤍 Thank you for the kind words", "Nema još tvojih slika 📸": "You have not added any photos yet 📸", "Greška pri učitavanju": "Loading failed", "Izbriši fotografiju": "Delete photo", "Internet vraćen — pokušavam upload 📡": "Internet restored — retrying upload 📡", "PhotoDump Demo": "PhotoDump Demo", "Isprobaj PhotoDump galeriju ✨": "Try the PhotoDump gallery ✨", "Ovo je interaktivni demo prikaz aplikacije za evente. Možeš klikati kroz galeriju, upload, profil i posvete.": "This is an interactive demo of the event app. Explore the gallery, upload, profile and messages.", "Uđi u demo galeriju 📸": "Enter the demo gallery 📸", "Demo koristi fiksne fotografije i služi samo za prikaz funkcionalnosti.": "The demo uses fixed photos and is only intended to showcase the features.", "Ovako gosti u stvarnom vremenu vide fotografije s eventa.": "This is how guests see event photos in real time.", "U pravoj aplikaciji gosti ovdje dodaju fotografije iz kamere ili galerije.": "In the real app, guests add photos from the camera or gallery here.", "Kako upload radi?": "How does uploading work?", "U stvarnoj aplikaciji gost odabere fotografije, aplikacija ih automatski pripremi i objavi u galeriji eventa.": "In the real app, the guest selects photos and the app automatically prepares and publishes them in the event gallery.", "📸 upload iz kamere": "📸 upload from camera", "🖼️ upload više slika iz galerije": "🖼️ upload multiple gallery photos", "⚡ slike se prikazuju gostima u realnom vremenu": "⚡ photos appear to guests in real time", "🛡️ moderator može sakriti neprimjeren sadržaj": "🛡️ the moderator can hide unsuitable content", "💌 Dodaj posvetu": "💌 Add a message", "Dobrodošao/la": "Welcome", "Tvoj profil": "Your profile", "Ovdje gost vidi fotografije koje je sam dodao.": "Here the guest sees the photos they added.", "U pravoj aplikaciji ovdje se prikazuju samo fotografije koje je taj gost objavio na eventu, te ih može izbrisati.": "In the real app, only that guest's event photos are shown here, and they can delete them.", "Napiši posvetu mladencima...": "Write a message to the couple...", "PhotoDump Admin": "PhotoDump Admin", "Prijava za organizatore i administratore": "Login for organizers and administrators", "Email": "Email", "Lozinka": "Password", "Minimalno 6 znakova": "At least 6 characters", "Prijavi se 🚀": "Log in 🚀", "Nemam račun — registracija": "I do not have an account — register", "Ime": "First name", "Prezime": "Last name", "Kreiraj račun ✨": "Create account ✨", "Već imam račun — prijava": "I already have an account — log in", "Registracija": "Registration", "Kreiraj račun organizatora. Pristup mora odobriti administrator.": "Create an organizer account. Access must be approved by an administrator.", "Unesi email i lozinku.": "Enter your email and password.", "Email adresa nije ispravna.": "The email address is invalid.", "Pogrešan email ili lozinka.": "Incorrect email or password.", "Račun s ovim emailom već postoji.": "An account with this email already exists.", "Lozinka mora imati minimalno 6 znakova.": "The password must contain at least 6 characters.", "Previše pokušaja. Probaj ponovno kasnije.": "Too many attempts. Try again later.", "Problem s internet vezom.": "Internet connection problem.", "Dogodila se greška. Pokušaj ponovno.": "Something went wrong. Please try again.", "Korisnički profil nije pronađen.": "User profile not found.", "Račun je deaktiviran. Obrati se administratoru.": "The account is disabled. Contact the administrator.", "Račun čeka odobrenje administratora.": "The account is awaiting administrator approval.", "Unesi ime i prezime.": "Enter your first and last name.", "Račun je kreiran i čeka odobrenje administratora.": "The account has been created and is awaiting administrator approval.", "Admin - PhotoDump": "Admin - PhotoDump", "✨ Admin panel": "✨ Admin panel", "Upravljanje sadržajem ⚙️": "Content management ⚙️", "🟣 Odabir": "🟣 Select", "✅ Označi sve": "✅ Select all", "🚫 Sakrij": "🚫 Hide", "👁 Vrati": "👁 Restore", "Slideshow": "Slideshow", "Brzina slideshowa": "Slideshow speed", "Brzo — 1.5 sek": "Fast — 1.5 sec", "Normalno — 3 sek": "Normal — 3 sec", "Sporo — 5 sek": "Slow — 5 sec", "Jako sporo — 8 sek": "Very slow — 8 sec", "Prikaži ime autora": "Show author name", "📥 Preuzmi ZIP svih fotografija": "📥 Download ZIP of all photos", "Preporučeno preuzimanje preko laptopa/računala zbog veličine datoteke": "Downloading on a laptop/computer is recommended due to file size", "Prikaži posvete u slideshowu": "Show messages in slideshow", "Nema event ID-a": "No event ID", "Nema fotografija za prikaz.": "No photos to display.", "Greška kod učitavanja fotografija.": "Could not load photos.", "Maknuti sliku?": "Hide this photo?", "Vratiti sliku?": "Restore this photo?", "Greška kod promjene slike.": "Could not update the photo.", "Nema posveta.": "No messages.", "Greška kod učitavanja posveta.": "Could not load messages.", "Gost": "Guest", "Učitavam slideshow...": "Loading slideshow...", "Nema vidljivih fotografija za slideshow.": "There are no visible photos for the slideshow.", "Greška kod učitavanja slideshowa.": "Could not load the slideshow.", "Nisi označio slike.": "No photos selected.", "Sakriveno ✔": "Hidden ✔", "Greška kod sakrivanja slika.": "Could not hide the photos.", "Vraćeno ✔": "Restored ✔", "Greška kod vraćanja slika.": "Could not restore the photos.", "ZIP alat nije učitan. Osvježi stranicu i pokušaj ponovno.": "The ZIP tool did not load. Refresh the page and try again.", "Preuzimanje ZIP datoteke može potrajati.": "Downloading the ZIP file may take a while.", "Želiš nastaviti?": "Do you want to continue?", "Ovo može potrajati": "This may take a while", "Nema vidljivih fotografija za preuzimanje.": "There are no visible photos to download.", "Nije moguće preuzeti fotografije.": "The photos could not be downloaded.", "Još malo": "Almost there", "Greška kod pripreme ZIP datoteke.": "Could not prepare the ZIP file.", "Main Admin - PhotoDump": "Main Admin - PhotoDump", "⚙️ PhotoDump Main Admin": "⚙️ PhotoDump Main Admin", "👥 Korisnici": "👥 Users", "📸 Pregled eventova": "📸 Event overview", "🚪 Logout": "🚪 Log out", "Kreiraj novi event": "Create a new event", "Odaberi tip eventa, upiši naslov i dodaj točno 6 slika za bubble prikaz.": "Choose an event type, enter a title and add exactly 6 images for the bubble display.", "Naslov eventa": "Event title", "Naziv eventa": "Event name", "Tip eventa": "Event type", "Plan eventa": "Event plan", "Basic — 1000 slika": "Basic — 1,000 photos", "Standard — 1200 + originals": "Standard — 1,200 + originals", "Premium — 1500 + originals": "Premium — 1,500 + originals", "Dodaj 6 slika za bubble": "Add 6 images for bubbles", "✍️ Tekstovi aplikacije": "✍️ App text", "Naslov (index)": "Title (entry page)", "Tekst (index)": "Text (entry page)", "Naslov (upload)": "Title (upload)", "Tekst (upload)": "Text (upload)", "Naslov (profil)": "Title (profile)", "Tekst (profil)": "Text (profile)", "👀 Live preview": "👀 Live preview", "Index": "Entry", "Naslov index": "Entry title", "Tekst index": "Entry text", "Naslov upload": "Upload title", "Tekst upload": "Upload text", "Naslov profil": "Profile title", "Tekst profil": "Profile text", "Kreiraj event 🚀": "Create event 🚀", "📄 Materijali za klijenta": "📄 Client materials", "Nakon kreiranja eventa možeš odmah preuzeti PDF za slanje klijentu, dva premium print predloška i čisti QR kod.": "After creating the event, you can immediately download a client PDF, print PDF and clean QR code.", "📩 PDF za klijenta": "📩 Client PDF", "🌸 Floral poster PDF": "🌸 Floral poster PDF", "✨ Minimal poster PDF": "✨ Minimal poster PDF", "🔳 Čisti QR kod": "🔳 Clean QR code", "npr. Rođendan Ivan/Sveto krštenje Lucija/Mirko & Marica": "e.g. Ivan's Birthday/Lucija's Baptism/Mirko & Marica", "Upiši naslov eventa": "Enter the event title", "Dodaj točno 6 bubble slika": "Add exactly 6 bubble images", "Nisi prijavljen": "You are not logged in", "Kreiram event...": "Creating event...", "Greška kod kreiranja eventa": "Could not create the event", "Račun još nije odobren": "The account has not yet been approved", "Pregled eventova": "Event overview", "Analitika, linkovi i upravljanje eventovima": "Analytics, links and event management", "📊 Analitika": "📊 Analytics", "eventova u prikazu": "events displayed", "Učitavanje eventova...": "Loading events...", "✏️ Uredi event": "✏️ Edit event", "Detalji eventa": "Event details", "📋 Kopiraj event ID": "📋 Copy event ID", "➕ Produži 30 dana": "➕ Extend by 30 days", "⏳ Označi expired": "⏳ Mark as expired", "🧹 Označi očišćen": "🧹 Mark as cleaned", "Plan": "Plan", "Status": "Status", "Active": "Active", "Expired": "Expired", "Disabled": "Disabled", "Upload limit": "Upload limit", "Ističe": "Expires", "Allow originals": "Allow originals", "📸 Slike": "📸 Photos", "❤️ Lajkovi": "❤️ Likes", "💌 Posvete": "💌 Messages", "Iskorištenost eventa": "Event usage", "Guest link": "Guest link", "App link": "App link", "Admin link": "Admin link", "📝 Textovi": "📝 Texts", "💾 Spremi promjene": "💾 Save changes", "Pregled svih eventova i iskorištenosti": "Overview of all events and usage", "Ukupno eventova": "Total events", "Istekli / disabled": "Expired / disabled", "Ukupno slika": "Total photos", "Ukupno lajkova": "Total likes", "Ukupno posveta": "Total messages", "Iskorištenost limita": "Limit usage", "Najaktivniji organizator": "Most active organizer", "Nema eventova": "No events", "Event ne postoji": "Event does not exist", "Spremljeno ✅": "Saved ✅", "Greška kod spremanja eventa.": "Could not save the event.", "Event ID kopiran ✅": "Event ID copied ✅", "Event produžen 30 dana ✅": "Event extended by 30 days ✅", "Označiti event kao expired?": "Mark this event as expired?", "Event označen kao expired ✅": "Event marked as expired ✅", "Označiti event kao očišćen? Ovo ne briše Storage automatski.": "Mark the event as cleaned? This does not automatically delete Storage files.", "Event označen kao očišćen ✅": "Event marked as cleaned ✅", "Istekao": "Expired", "Još 1 dan": "1 day remaining", "Korisnici": "Users", "Upravljanje organizatorima i pristupima": "Manage organizers and access", "Pretraži po imenu ili emailu...": "Search by name or email...", "Čekaju": "Pending", "Odobreni": "Approved", "Deaktivirani": "Disabled", "Učitavanje korisnika...": "Loading users...", "Nema korisnika za prikaz.": "No users to display.", "Deaktiviran": "Disabled", "Odobren": "Approved", "Čeka odobrenje": "Awaiting approval", "Bez emaila": "No email", "Bez imena": "No name", "Sigurno želiš ovom korisniku dati SUPERADMIN ovlasti?": "Are you sure you want to give this user SUPERADMIN privileges?", "Greška kod promjene korisnika.": "Could not update the user.", "Račun nije odobren ili je deaktiviran": "The account is not approved or is disabled", "PhotoDump Event": "PhotoDump Event", "Otvaram tvoj event...": "Opening your event...", "Odaberi event.": "Choose an event.", "Upiši event ID ili zalijepi event link": "Enter the event ID or paste the event link", "Upiši event ID ili zalijepi event link.": "Enter the event ID or paste the event link.", "Glavna navigacija": "Main navigation", "Glavne prednosti": "Key benefits", "Mobilni izbornik": "Mobile menu", "Nastavi skrolati": "Continue scrolling", "Odaberi primjer teme": "Choose a theme example", "Fotografija s eventa": "Event photo", "Fotografiraj": "Take a photo", "Prikaz slideshowa": "Slideshow preview", "Scena 1": "Scene 1", "Scena 2": "Scene 2", "Scena 3": "Scene 3", "Scena 4": "Scene 4", "Scena 5": "Scene 5", "Scena 6": "Scene 6", "Scena 7": "Scene 7", "Scena 8": "Scene 8", "Index title": "Entry title", "Index subtitle": "Entry subtitle", "Upload title": "Upload title", "Upload subtitle": "Upload subtitle", "Profile title": "Profile title", "Profile subtitle": "Profile subtitle", "DEMO MODE": "DEMO MODE", "Demo fotografija": "Demo photo", "PhotoDumpEvent početna": "PhotoDumpEvent home", "QR kod": "QR code", "QR kod za demo": "Demo QR code", "Slideshow fotografija": "Slideshow photo", "Animirani prikaz PhotoDumpEvent aplikacije": "Animated PhotoDumpEvent app preview", "🎉 Party": "🎉 Party", "Demo prikaz: u pravoj aplikaciji ova posveta bi se spremila.": "Demo preview: in the real app this message would be saved.", "Dobrodošao/la u demo galeriju. Ovo je prikaz bez spremanja podataka.": "Welcome to the demo gallery. This preview does not save data.", "Dobrodošli na našu ljubavnu priču 💍": "Welcome to our love story 💍", "Dobrodošli na ovaj sveti i poseban dan ✝️": "Welcome to this sacred and special day ✝️", "Dobrodošli na party 🔥": "Welcome to the party 🔥", "Dobrodošli na poseban dan naše male zvijezde ✨": "Welcome to our little star's special day ✨", "Dobrodošli na slavlje života 🎂": "Welcome to a celebration of life 🎂", "Dobrodošli u PhotoDump 📸": "Welcome to PhotoDump 📸", "Dodaj fotografiju i ostavi uspomenu za cijeli život 🤍": "Add a photo and leave a memory for a lifetime 🤍", "Dodaj najluđe i najbolje uspomene 🎉": "Add the wildest and best memories 🎉", "Dodajte svoje fotografije, lajkajte najljepše trenutke i ostavite posvetu.": "Add your photos, like the best moments and leave a message.", "Event nije pronađen": "Event not found", "Greška kod preuzimanja fotografije:": "Photo download error:", "Otvori galeriju, upiši svoje ime i dodaj fotografije s eventa.": "Open the gallery, enter your name and add photos from the event.", "Ovdje gost može napisati posvetu mladencima ili slavljeniku 💌": "Guests can leave a message for the couple or celebrant here 💌", "Preporučeno preuzimanje preko laptopa/računala zbog veličine datoteke.": "Downloading on a laptop or computer is recommended due to file size.", "Prvo kreiraj event.": "Create an event first.", "QR kod nije moguće preuzeti.": "The QR code could not be downloaded.", "Sve uspomene bit će spremljene na jednom mjestu.": "All memories will be saved in one place.", "Tvoje slike 🔥": "Your photos 🔥", "U pravoj aplikaciji ovdje gost odabire jednu ili više fotografija iz galerije.": "In the real app, guests select one or more photos from their gallery here.", "Uhvatite ljubav, sreću i zabavu 💍": "Capture the love, joy and celebration 💍", "Vaše uspomene 🤍": "Your memories 🤍", "Zabilježite ovaj sveti trenutak ✝️": "Capture this sacred moment ✝️", "Šibaj slike, nema filtera 😎": "Share the photos — no filters 😎", "⏳ Čeka odobrenje": "⏳ Awaiting approval"}, de: {"Najnovije":"Neueste","Najpopularnije":"Beliebteste","Najstarije":"Älteste","Prikaz":"Ansicht","Feed":"Feed","Grid":"Raster","Još nema fotografija 📸":"Noch keine Fotos 📸","Kako radi": "So funktioniert es", "Mogućnosti": "Funktionen", "Paketi": "Pakete", "Kontakt": "Kontakt", "Instaliraj": "Installieren", "Instaliraj aplikaciju": "App installieren", "Organizatori": "Veranstalter", "Prijava organizatora": "Veranstalter-Anmeldung", "Isprobaj demo": "Demo ausprobieren", "Otvori demo": "Demo öffnen", "Izbornik": "Menü", "Otvori izbornik": "Menü öffnen", "Zatvori izbornik": "Menü schließen", "Zatvori": "Schließen", "Nazad": "Zurück", "← Nazad": "← Zurück", "Da": "Ja", "Ne": "Nein", "Sve": "Alle", "Svi": "Alle", "Vidljive": "Sichtbar", "Skrivene": "Ausgeblendet", "Aktivni": "Aktiv", "Basic": "Basic", "Standard": "Standard", "Premium": "Premium", "Default": "Standard", "Event": "Event", "Učitavanje...": "Wird geladen...", "Učitavam...": "Wird geladen...", "Molim pričekaj...": "Bitte warten...", "Spremi postavke": "Einstellungen speichern", "Postavke": "Einstellungen", "⚙️ Postavke": "⚙️ Einstellungen", "Admin pristup": "Admin-Zugang", "Ulaz": "Öffnen", "Unesi lozinku": "Passwort eingeben", "Admin šifra": "Admin-Passwort", "Kriva šifra": "Falsches Passwort", "Kriva lozinka": "Falsches Passwort", "Nemaš pristup": "Kein Zugriff", "Greška kod provjere pristupa": "Fehler bei der Zugriffsprüfung", "Jezik": "Sprache", "Aplikacija": "App", "Moderator panel": "Moderationsbereich", "Instalacija na mobitel": "Auf dem Smartphone installieren", "PhotoDumpEvent uvijek na početnom zaslonu": "PhotoDumpEvent immer auf dem Startbildschirm", "Dodaj ovaj event na početni zaslon. Sljedeći put otvaraš ga direktno preko ikone, a event i prijavljeno ime ostaju zapamćeni.": "Füge dieses Event zum Startbildschirm hinzu. Beim nächsten Mal öffnest du es direkt über das Symbol; Event und angemeldeter Name bleiben gespeichert.", "Za spremanje konkretnog eventa prvo ga otvori preko QR koda ili linka, a zatim dodirni gumb za instalaciju unutar eventa. Tako će ikona uvijek otvarati baš taj event.": "Um ein bestimmtes Event zu speichern, öffne es zuerst über den QR-Code oder Link und tippe dann im Event auf Installieren. Das Symbol öffnet danach immer genau dieses Event.", "Aplikacija je već instalirana ✓": "Die App ist bereits installiert ✓", "Otvori je preko PhotoDumpEvent ikone na početnom zaslonu.": "Öffne sie über das PhotoDumpEvent-Symbol auf dem Startbildschirm.", "Za instalaciju na iPhoneu otvori ovu stranicu u Safariju.": "Öffne diese Seite zur Installation auf dem iPhone in Safari.", "Otvori PhotoDumpEvent u Safari pregledniku.": "Öffne PhotoDumpEvent in Safari.", "Dodirni ikonu dijeljenja Share.": "Tippe auf das Teilen-Symbol.", "Odaberi Dodaj na početni zaslon.": "Wähle Zum Home-Bildschirm.", "Provjeri naziv i dodirni Dodaj.": "Prüfe den Namen und tippe auf Hinzufügen.", "Otvori PhotoDumpEvent u Chromeu.": "Öffne PhotoDumpEvent in Chrome.", "Ako se pojavi poruka, dodirni Instaliraj aplikaciju.": "Wenn eine Meldung erscheint, tippe auf App installieren.", "Ako se ne pojavi, dodirni izbornik ⋮.": "Falls sie nicht erscheint, tippe auf das Menü ⋮.", "Odaberi Dodaj na početni zaslon ili Instaliraj aplikaciju.": "Wähle Zum Startbildschirm hinzufügen oder App installieren.", "Instaliraj sada": "Jetzt installieren", "Nema trgovine aplikacija ni dodatnih preuzimanja. Instalacija traje manje od minute.": "Kein App-Store und keine zusätzlichen Downloads. Die Installation dauert weniger als eine Minute.", "PhotoDumpEvent — QR galerija za vjenčanja i evente": "PhotoDumpEvent — QR-Galerie für Hochzeiten und Events", "Digitalna galerija koja raste tijekom eventa": "Eine digitale Galerie, die während des Events wächst", "Jedan QR kod.": "Ein QR-Code.", "Stotine pogleda.": "Hunderte Perspektiven.", "Jedna uspomena.": "Eine gemeinsame Erinnerung.", "Gosti skeniraju, fotografiraju i dijele trenutke bez instalacije aplikacije. Ti dobivaš jednu živu galeriju, posvete, slideshow i sve uspomene na jednom mjestu.": "Gäste scannen, fotografieren und teilen Momente ohne App-Installation. Du erhältst eine Live-Galerie, Nachrichten, eine Diashow und alle Erinnerungen an einem Ort.", "Doživi kako radi": "Erlebe, wie es funktioniert", "Bez instalacije": "Keine Installation", "QR pristup": "QR-Zugang", "Već imaš event?": "Du hast bereits ein Event?", "Upiši ID ili zalijepi cijeli link.": "Gib die ID ein oder füge den vollständigen Link ein.", "Event ID ili link": "Event-ID oder Link", "Otvori event": "Event öffnen", "Galerija uspomena": "Erinnerungsgalerie", "fotki": "Fotos", "srca": "Herzen", "Nova fotografija": "Neues Foto", "upravo dodano": "gerade hinzugefügt", "nova srca": "neue Herzen", "Scrollaj priču": "Scrolle durch die Geschichte", "Od praznog eventa do galerije pune života": "Vom leeren Event zur lebendigen Galerie", "Ne objašnjavamo proizvod.": "Wir erklären das Produkt nicht nur.", "Pokazujemo kako nastaje.": "Wir zeigen, wie es entsteht.", "Prije prvog gosta": "Vor dem ersten Gast", "Event još nije počeo. Uspomene samo što nisu stigle.": "Das Event hat noch nicht begonnen. Die Erinnerungen kommen gleich.", "Dobivaš vlastiti link i QR kod, prilagođen naziv, boje i tekstove eventa.": "Du erhältst einen eigenen Link und QR-Code sowie angepasste Namen, Farben und Eventtexte.", "Jedan pokret kamerom": "Nur einen Scan entfernt", "Postavi QR kod na stol. Ostalo rade gosti.": "Stelle den QR-Code auf den Tisch. Den Rest erledigen die Gäste.", "Skeniranje otvara event direktno u pregledniku. Nema trgovine aplikacija, registracije ni lozinki.": "Der Scan öffnet das Event direkt im Browser. Kein App-Store, keine Registrierung und keine Passwörter.", "Ulazak u nekoliko sekundi": "In wenigen Sekunden dabei", "Gost upiše ime i odmah je unutra.": "Der Gast gibt seinen Namen ein und ist sofort dabei.", "Sučelje je jasno i ljudima koji aplikaciju vide prvi put. Jedan unos, jedan dodir, gotovo.": "Die Oberfläche ist auch für Erstnutzer klar. Eine Eingabe, ein Tippen, fertig.", "Trenutak nastaje": "Ein Moment entsteht", "Fotograf vidi ceremoniju. Gosti vide sve ostalo.": "Der Fotograf sieht die Zeremonie. Die Gäste sehen alles andere.", "Kamera ili galerija. Fotografija se pripremi, prenese i pojavi u zajedničkom feedu.": "Kamera oder Galerie. Das Foto wird vorbereitet, hochgeladen und erscheint im gemeinsamen Feed.", "Galerija živi": "Die Galerie lebt", "Svaki gost vidi drugi trenutak. PhotoDump ih spaja u jednu priču.": "Jeder Gast sieht einen anderen Moment. PhotoDump verbindet sie zu einer Geschichte.", "Fotografije stižu tijekom eventa, brojači rastu, a galerija se puni pred očima svih gostiju.": "Fotos treffen während des Events ein, die Zähler steigen und die Galerie füllt sich vor den Augen aller Gäste.", "Reakcije i posvete": "Reaktionen und Nachrichten", "Nisu spremljene samo fotografije. Spremljene su i riječi.": "Nicht nur Fotos werden gespeichert. Auch die Worte bleiben.", "Lajkovi, poruke i posvete čuvaju atmosferu večeri, ne samo kadar.": "Likes und Nachrichten bewahren die Stimmung des Abends, nicht nur das Bild.", "Kontrola bez prekidanja zabave": "Kontrolle, ohne die Feier zu stören", "Vi slavite. Sadržaj je i dalje pod kontrolom.": "Ihr feiert. Die Inhalte bleiben unter Kontrolle.", "Moderator jednim dodirom skriva fotografiju koja ne pripada javnoj galeriji.": "Ein Moderator blendet ungeeignete Fotos mit einem Tippen aus.", "Veliko finale": "Das große Finale", "Dok event još traje, uspomene se već prikazuju.": "Während das Event noch läuft, werden die Erinnerungen bereits angezeigt.", "Slideshow pretvara fotografije gostiju u živu kulisu na televizoru, projektoru ili velikom ekranu.": "Die Diashow verwandelt Gästefotos in eine lebendige Kulisse auf Fernseher, Projektor oder Großbildschirm.", "Skeniraj za ulaz": "Scannen zum Öffnen", "Galerija čeka prve uspomene.": "Die Galerie wartet auf die ersten Erinnerungen.", "Dobrodošli": "Willkommen", "Podijelite trenutke koje ćemo pamtiti cijeli život.": "Teilt Momente, an die wir uns ein Leben lang erinnern werden.", "Uđi u event": "Event öffnen", "Još samo jedan korak": "Nur noch ein Schritt", "Kako se zoveš?": "Wie heißt du?", "Uđi u galeriju": "Galerie öffnen", "Uđi u galeriju 📸": "Galerie öffnen 📸", "Bez registracije i instalacije.": "Keine Registrierung und keine Installation.", "Fotografija dodana": "Foto hinzugefügt", "UŽIVO": "LIVE", "posveta": "Nachrichten", "Sakriveno": "Ausgeblendet", "Posvete gostiju": "Nachrichten der Gäste", "Riječi koje ostaju.": "Worte, die bleiben.", "Želimo vam cijeli život ovakvih osmijeha 🤍": "Wir wünschen euch ein Leben voller solcher Lächeln 🤍", "Hvala na večeri koju ćemo dugo pamtiti!": "Danke für einen Abend, an den wir uns lange erinnern werden!", "Najbolji party ove godine 🔥": "Die beste Party des Jahres 🔥", "TRENUTNO NA EKRANU": "JETZT AUF DEM BILDSCHIRM", "Fotografija gosta": "Gästefoto", "Fotografija skrivena": "Foto ausgeblendet", "Više nije vidljiva u galeriji": "Es ist nicht mehr in der Galerie sichtbar", "Slideshow uživo": "Live-Diashow", "Trenuci koje nitko nije planirao": "Momente, die niemand geplant hat", "Najbolje fotografije često nastanu": "Die besten Fotos entstehen oft", "kad nitko ne pozira.": "wenn niemand posiert.", "Upravo dodano": "Gerade hinzugefügt", "Jedan event": "Ein Event", "Stotine perspektiva": "Hunderte Perspektiven", "Jedna zajednička galerija": "Eine gemeinsame Galerie", "Jedna aplikacija. Svaki stil.": "Eine App. Jeder Stil.", "Dizajn koji pripada": "Ein Design, das", "baš tom eventu.": "genau zu diesem Event passt.", "Vjenčanje": "Hochzeit", "Krštenje": "Taufe", "Rođendan": "Geburtstag", "Prva pričest": "Erstkommunion", "Pričest": "Kommunion", "Svadba": "Hochzeit", "✨ Krštenje": "✨ Taufe", "💍 Vjenčanje": "💍 Hochzeit", "Elegantna galerija za trenutke koji se ne ponavljaju.": "Eine elegante Galerie für einmalige Momente.", "Boje, tekstovi i atmosfera prilagođeni su mladencima i stilu proslave.": "Farben, Texte und Atmosphäre werden an das Paar und den Stil der Feier angepasst.", "Nježna digitalna uspomena za obitelj i najbliže.": "Eine liebevolle digitale Erinnerung für Familie und Freunde.", "Svijetla paleta, mirnija atmosfera i prostor za fotografije i posvete cijele obitelji.": "Eine helle Farbwelt, eine ruhige Atmosphäre und Platz für Fotos und Nachrichten der ganzen Familie.", "Brza, energična galerija koja raste sa svakim beatom.": "Eine schnelle, energiegeladene Galerie, die mit jedem Beat wächst.", "Neonski detalji, dinamične fotografije i feed koji izgleda kao dio same zabave.": "Neon-Details, dynamische Fotos und ein Feed, der Teil der Party wird.", "Sve što treba. Ništa što smeta.": "Alles, was du brauchst. Nichts, was stört.", "Gostima jednostavno.": "Einfach für Gäste.", "Organizatoru moćno.": "Leistungsstark für Veranstalter.", "Otvaranje eventa jednim skeniranjem, bez instalacije i registracije.": "Event mit einem Scan öffnen, ohne Installation oder Registrierung.", "Brzi upload": "Schneller Upload", "Fotografiranje ili odabir više slika iz galerije, direktno s mobitela.": "Fotografieren oder mehrere Bilder direkt vom Smartphone auswählen.", "Lajkovi i posvete": "Likes und Nachrichten", "Reakcije i poruke pretvaraju galeriju u živu zajedničku priču.": "Reaktionen und Nachrichten machen die Galerie zu einer lebendigen gemeinsamen Geschichte.", "Sakrivanje neprimjerenog sadržaja bez prekidanja eventa.": "Ungeeignete Inhalte ausblenden, ohne das Event zu unterbrechen.", "Fotografije gostiju prikazuju se na televizoru, projektoru ili LED ekranu.": "Gästefotos werden auf Fernseher, Projektor oder LED-Bildschirm gezeigt.", "Custom dizajn": "Individuelles Design", "Naziv, tekstovi, boje i atmosfera prilagođeni svakom događaju.": "Name, Texte, Farben und Atmosphäre werden an jedes Event angepasst.", "Od intimne proslave": "Von der kleinen Feier", "do": "bis zum", "velikog eventa.": "großen Event.", "Paketi su prilagođeni veličini eventa i potrebama klijenta.": "Pakete sind auf die Größe des Events und die Bedürfnisse des Kunden abgestimmt.", "Na upit": "Auf Anfrage", "Za manje evente i jednostavno prikupljanje fotografija.": "Für kleinere Events und einfaches Sammeln von Fotos.", "Do 1000 fotografija": "Bis zu 1.000 Fotos", "QR link": "QR-Link", "Galerija, upload i profil": "Galerie, Upload und Profil", "Osnovna tema događaja": "Grunddesign des Events", "Pošalji upit": "Anfrage senden", "Najbolji izbor": "Beste Wahl", "Najbolji omjer mogućnosti i jednostavnosti za većinu evenata.": "Das beste Verhältnis aus Funktionen und Einfachheit für die meisten Events.", "Do 1500 fotografija": "Bis zu 1.500 Fotos", "Originali uključeni": "Originaldateien inklusive", "Za veće evente i dodatni premium dojam tijekom cijele večeri.": "Für größere Events und ein zusätzliches Premium-Erlebnis während des gesamten Abends.", "Do 3000 fotografija": "Bis zu 3.000 Fotos", "Custom QR kodovi": "Individuelle QR-Codes", "Slideshow prikaz": "Diashow-Anzeige", "Još samo nekoliko odgovora": "Noch ein paar Antworten", "Jednostavno od prvog": "Einfach vom ersten", "do zadnjeg skena.": "bis zum letzten Scan.", "Treba li gost instalirati aplikaciju?": "Muss der Gast eine App installieren?", "Ne. Gost skenira QR kod i otvara event u pregledniku na Androidu ili iPhoneu.": "Nein. Der Gast scannt den QR-Code und öffnet das Event im Browser auf Android oder iPhone.", "Tko može vidjeti fotografije?": "Wer kann die Fotos sehen?", "Fotografije su dostupne preko event linka ili QR koda, a organizator može moderirati sadržaj.": "Fotos sind über den Event-Link oder QR-Code verfügbar, und der Veranstalter kann Inhalte moderieren.", "Mogu li dobiti sve fotografije nakon eventa?": "Kann ich nach dem Event alle Fotos erhalten?", "Da. Fotografije se nakon eventa mogu pripremiti za preuzimanje prema dogovorenom paketu.": "Ja. Nach dem Event können die Fotos gemäß dem vereinbarten Paket zum Download bereitgestellt werden.", "Radi li na mobitelima?": "Funktioniert es auf Smartphones?", "Da. Aplikacija je prvenstveno izrađena za mobitel i radi na Androidu i iPhoneu.": "Ja. Die App wurde hauptsächlich für Smartphones entwickelt und funktioniert auf Android und iPhone.", "Event traje jednu večer.": "Das Event dauert einen Abend.", "Uspomene": "Erinnerungen", "ostaju.": "bleiben.", "Isprobaj aplikaciju iz perspektive gosta ili se javi za termin i ponudu.": "Teste die App aus Sicht eines Gastes oder frage einen Termin und ein Angebot an.", "Zatraži ponudu": "Angebot anfragen", "Digitalna galerija uspomena za vjenčanja i evente.": "Eine digitale Erinnerungsgalerie für Hochzeiten und Events.", "Upiši ime i prezime": "Vor- und Nachnamen eingeben", "Tvoje ime i prezime": "Dein Vor- und Nachname", "Event nije pronađen. Otvori aplikaciju putem QR koda.": "Event nicht gefunden. Öffne die App über den QR-Code.", "Nema aktivnog eventa": "Kein aktives Event", "Otvori aplikaciju putem QR koda ili linka eventa.": "Öffne die App über den QR-Code oder Event-Link.", "Učitavanje eventa...": "Event wird geladen...", "Molimo pričekaj trenutak.": "Bitte einen Moment warten.", "Dobrodošli na našu svadbu 💍": "Willkommen zu unserer Hochzeit 💍", "Dobrodošli na rođendan 🎂": "Willkommen zur Geburtstagsfeier 🎂", "Dobrodošli na krštenje ✨": "Willkommen zur Taufe ✨", "Dobrodošli na pričest ✝️": "Willkommen zur Kommunion ✝️", "Dobrodošli na party 🎉": "Willkommen zur Party 🎉", "Podijelite uspomene 📸": "Erinnerungen teilen 📸", "Galerija uspomena 🤍": "Erinnerungsgalerie 🤍", "Svaka fotografija postaje dio uspomena": "Jedes Foto wird Teil der Erinnerungen", "Podijeli trenutak 📸": "Teile einen Moment 📸", "Dodaj fotografiju i ostavi uspomenu": "Füge ein Foto hinzu und hinterlasse eine Erinnerung", "Uhvati trenutak": "Moment aufnehmen", "Odaberi slike": "Fotos auswählen", "Najviše 15 fotografija po odabiru.": "Maximal 15 Fotos pro Auswahl.", "Možeš odabrati najviše 15 fotografija odjednom. Prenosit će se prvih 15.": "Du kannst höchstens 15 Fotos auf einmal auswählen. Die ersten 15 werden hochgeladen.", "Napiši posvetu": "Nachricht schreiben", "💌 Napiši posvetu": "💌 Nachricht schreiben", "Napiši posvetu 💌": "Nachricht schreiben 💌", "Posvetu vide mladenci ili organizator eventa.": "Die Nachricht ist für das Paar oder den Veranstalter sichtbar.", "Posvete vide mladenci ili organizator eventa.": "Nachrichten sind für das Paar oder den Veranstalter sichtbar.", "Ovdje su tvoje fotografije": "Hier siehst du deine Fotos", "Tvoje uspomene": "Deine Erinnerungen", "Želite li obrisati sliku?": "Möchtest du dieses Foto löschen?", "Da, obriši": "Ja, löschen", "Napiši lijepu poruku, čestitku ili uspomenu...": "Schreibe eine liebe Nachricht, einen Wunsch oder eine Erinnerung...", "Pošalji posvetu ✉": "Nachricht senden ✉", "Odustani": "Abbrechen", "Fotografije se učitavaju": "Fotos werden hochgeladen", "Pripremam upload...": "Upload wird vorbereitet...", "Molimo ne zatvaraj aplikaciju dok upload traje.": "Bitte schließe die App während des Uploads nicht.", "Event je istekao ⏳": "Das Event ist abgelaufen ⏳", "Dosegnut je limit fotografija 📸": "Das Fotolimit wurde erreicht 📸", "Event nije pronađen 😕": "Event nicht gefunden 😕", "Upload završen 🤍": "Upload abgeschlossen 🤍", "Fotografija nije odabrana 😕": "Kein Foto ausgewählt 😕", "Fotografija je obrisana 🗑️": "Foto gelöscht 🗑️", "Nemaš dozvolu za brisanje ove fotografije 😕": "Du hast keine Berechtigung, dieses Foto zu löschen 😕", "Greška kod brisanja fotografije 😕": "Fehler beim Löschen des Fotos 😕", "Napiši poruku 🤍": "Schreibe eine Nachricht 🤍", "🤍 Hvala na lijepim riječima": "🤍 Danke für die lieben Worte", "Nema još tvojih slika 📸": "Du hast noch keine Fotos hinzugefügt 📸", "Greška pri učitavanju": "Fehler beim Laden", "Izbriši fotografiju": "Foto löschen", "Internet vraćen — pokušavam upload 📡": "Internetverbindung wiederhergestellt — Upload wird erneut versucht 📡", "PhotoDump Demo": "PhotoDump Demo", "Isprobaj PhotoDump galeriju ✨": "PhotoDump-Galerie ausprobieren ✨", "Ovo je interaktivni demo prikaz aplikacije za evente. Možeš klikati kroz galeriju, upload, profil i posvete.": "Dies ist eine interaktive Demo der Event-App. Entdecke Galerie, Upload, Profil und Nachrichten.", "Uđi u demo galeriju 📸": "Demo-Galerie öffnen 📸", "Demo koristi fiksne fotografije i služi samo za prikaz funkcionalnosti.": "Die Demo verwendet feste Fotos und dient nur zur Darstellung der Funktionen.", "Ovako gosti u stvarnom vremenu vide fotografije s eventa.": "So sehen Gäste die Eventfotos in Echtzeit.", "U pravoj aplikaciji gosti ovdje dodaju fotografije iz kamere ili galerije.": "In der echten App fügen Gäste hier Fotos aus Kamera oder Galerie hinzu.", "Kako upload radi?": "Wie funktioniert der Upload?", "U stvarnoj aplikaciji gost odabere fotografije, aplikacija ih automatski pripremi i objavi u galeriji eventa.": "In der echten App wählt der Gast Fotos aus; die App bereitet sie automatisch vor und veröffentlicht sie in der Event-Galerie.", "📸 upload iz kamere": "📸 Upload von der Kamera", "🖼️ upload više slika iz galerije": "🖼️ Mehrere Fotos aus der Galerie hochladen", "⚡ slike se prikazuju gostima u realnom vremenu": "⚡ Fotos werden Gästen in Echtzeit angezeigt", "🛡️ moderator može sakriti neprimjeren sadržaj": "🛡️ Der Moderator kann ungeeignete Inhalte ausblenden", "💌 Dodaj posvetu": "💌 Nachricht hinzufügen", "Dobrodošao/la": "Willkommen", "Tvoj profil": "Dein Profil", "Ovdje gost vidi fotografije koje je sam dodao.": "Hier sieht der Gast die von ihm hinzugefügten Fotos.", "U pravoj aplikaciji ovdje se prikazuju samo fotografije koje je taj gost objavio na eventu, te ih može izbrisati.": "In der echten App werden hier nur die Eventfotos dieses Gastes angezeigt, die er auch löschen kann.", "Napiši posvetu mladencima...": "Schreibe dem Paar eine Nachricht...", "PhotoDump Admin": "PhotoDump Admin", "Prijava za organizatore i administratore": "Anmeldung für Veranstalter und Administratoren", "Email": "E-Mail", "Lozinka": "Passwort", "Minimalno 6 znakova": "Mindestens 6 Zeichen", "Prijavi se 🚀": "Anmelden 🚀", "Nemam račun — registracija": "Ich habe noch kein Konto — registrieren", "Ime": "Vorname", "Prezime": "Nachname", "Kreiraj račun ✨": "Konto erstellen ✨", "Već imam račun — prijava": "Ich habe bereits ein Konto — anmelden", "Registracija": "Registrierung", "Kreiraj račun organizatora. Pristup mora odobriti administrator.": "Erstelle ein Veranstalterkonto. Der Zugang muss von einem Administrator freigegeben werden.", "Unesi email i lozinku.": "Gib E-Mail-Adresse und Passwort ein.", "Email adresa nije ispravna.": "Die E-Mail-Adresse ist ungültig.", "Pogrešan email ili lozinka.": "Falsche E-Mail-Adresse oder falsches Passwort.", "Račun s ovim emailom već postoji.": "Ein Konto mit dieser E-Mail-Adresse existiert bereits.", "Lozinka mora imati minimalno 6 znakova.": "Das Passwort muss mindestens 6 Zeichen enthalten.", "Previše pokušaja. Probaj ponovno kasnije.": "Zu viele Versuche. Bitte später erneut versuchen.", "Problem s internet vezom.": "Problem mit der Internetverbindung.", "Dogodila se greška. Pokušaj ponovno.": "Ein Fehler ist aufgetreten. Bitte erneut versuchen.", "Korisnički profil nije pronađen.": "Benutzerprofil nicht gefunden.", "Račun je deaktiviran. Obrati se administratoru.": "Das Konto wurde deaktiviert. Wende dich an den Administrator.", "Račun čeka odobrenje administratora.": "Das Konto wartet auf die Freigabe durch einen Administrator.", "Unesi ime i prezime.": "Gib Vor- und Nachnamen ein.", "Račun je kreiran i čeka odobrenje administratora.": "Das Konto wurde erstellt und wartet auf die Freigabe durch einen Administrator.", "Admin - PhotoDump": "Admin - PhotoDump", "✨ Admin panel": "✨ Admin-Bereich", "Upravljanje sadržajem ⚙️": "Inhaltsverwaltung ⚙️", "🟣 Odabir": "🟣 Auswählen", "✅ Označi sve": "✅ Alle auswählen", "🚫 Sakrij": "🚫 Ausblenden", "👁 Vrati": "👁 Wiederherstellen", "Slideshow": "Diashow", "Brzina slideshowa": "Diashow-Geschwindigkeit", "Brzo — 1.5 sek": "Schnell — 1,5 Sek.", "Normalno — 3 sek": "Normal — 3 Sek.", "Sporo — 5 sek": "Langsam — 5 Sek.", "Jako sporo — 8 sek": "Sehr langsam — 8 Sek.", "Prikaži ime autora": "Autorenname anzeigen", "📥 Preuzmi ZIP svih fotografija": "📥 ZIP mit allen Fotos herunterladen", "Preporučeno preuzimanje preko laptopa/računala zbog veličine datoteke": "Wegen der Dateigröße wird der Download auf einem Laptop/Computer empfohlen", "Prikaži posvete u slideshowu": "Nachrichten in der Diashow anzeigen", "Nema event ID-a": "Keine Event-ID", "Nema fotografija za prikaz.": "Keine Fotos zum Anzeigen.", "Greška kod učitavanja fotografija.": "Fehler beim Laden der Fotos.", "Maknuti sliku?": "Foto ausblenden?", "Vratiti sliku?": "Foto wiederherstellen?", "Greška kod promjene slike.": "Fehler beim Ändern des Fotos.", "Nema posveta.": "Keine Nachrichten.", "Greška kod učitavanja posveta.": "Fehler beim Laden der Nachrichten.", "Gost": "Gast", "Učitavam slideshow...": "Diashow wird geladen...", "Nema vidljivih fotografija za slideshow.": "Keine sichtbaren Fotos für die Diashow.", "Greška kod učitavanja slideshowa.": "Fehler beim Laden der Diashow.", "Nisi označio slike.": "Keine Fotos ausgewählt.", "Sakriveno ✔": "Ausgeblendet ✔", "Greška kod sakrivanja slika.": "Fehler beim Ausblenden der Fotos.", "Vraćeno ✔": "Wiederhergestellt ✔", "Greška kod vraćanja slika.": "Fehler beim Wiederherstellen der Fotos.", "ZIP alat nije učitan. Osvježi stranicu i pokušaj ponovno.": "Das ZIP-Tool wurde nicht geladen. Aktualisiere die Seite und versuche es erneut.", "Preuzimanje ZIP datoteke može potrajati.": "Das Herunterladen der ZIP-Datei kann eine Weile dauern.", "Želiš nastaviti?": "Möchtest du fortfahren?", "Ovo može potrajati": "Das kann etwas dauern", "Nema vidljivih fotografija za preuzimanje.": "Keine sichtbaren Fotos zum Herunterladen.", "Nije moguće preuzeti fotografije.": "Die Fotos konnten nicht heruntergeladen werden.", "Još malo": "Fast geschafft", "Greška kod pripreme ZIP datoteke.": "Fehler beim Erstellen der ZIP-Datei.", "Main Admin - PhotoDump": "Main Admin - PhotoDump", "⚙️ PhotoDump Main Admin": "⚙️ PhotoDump Main Admin", "👥 Korisnici": "👥 Benutzer", "📸 Pregled eventova": "📸 Event-Übersicht", "🚪 Logout": "🚪 Abmelden", "Kreiraj novi event": "Neues Event erstellen", "Odaberi tip eventa, upiši naslov i dodaj točno 6 slika za bubble prikaz.": "Wähle einen Event-Typ, gib einen Titel ein und füge genau 6 Bilder für die Bubble-Anzeige hinzu.", "Naslov eventa": "Event-Titel", "Naziv eventa": "Event-Name", "Tip eventa": "Event-Typ", "Plan eventa": "Event-Paket", "Basic — 1000 slika": "Basic — 1.000 Fotos", "Standard — 1200 + originals": "Standard — 1.200 + Originale", "Premium — 1500 + originals": "Premium — 1.500 + Originale", "Dodaj 6 slika za bubble": "6 Bilder für Bubbles hinzufügen", "✍️ Tekstovi aplikacije": "✍️ App-Texte", "Naslov (index)": "Titel (Einstiegsseite)", "Tekst (index)": "Text (Einstiegsseite)", "Naslov (upload)": "Titel (Upload)", "Tekst (upload)": "Text (Upload)", "Naslov (profil)": "Titel (Profil)", "Tekst (profil)": "Text (Profil)", "👀 Live preview": "👀 Live-Vorschau", "Index": "Einstieg", "Naslov index": "Einstiegstitel", "Tekst index": "Einstiegstext", "Naslov upload": "Upload-Titel", "Tekst upload": "Upload-Text", "Naslov profil": "Profil-Titel", "Tekst profil": "Profil-Text", "Kreiraj event 🚀": "Event erstellen 🚀", "📄 Materijali za klijenta": "📄 Kundenmaterialien", "Nakon kreiranja eventa možeš odmah preuzeti PDF za slanje klijentu, dva premium print predloška i čisti QR kod.": "Nach dem Erstellen des Events kannst du sofort ein Kunden-PDF, zwei Premium-Druckvorlagen und einen reinen QR-Code herunterladen.", "📩 PDF za klijenta": "📩 Kunden-PDF", "🌸 Floral poster PDF": "🌸 Floral-Poster PDF", "✨ Minimal poster PDF": "✨ Minimal-Poster PDF", "🔳 Čisti QR kod": "🔳 Reiner QR-Code", "npr. Rođendan Ivan/Sveto krštenje Lucija/Mirko & Marica": "z. B. Ivans Geburtstag/Lucijas Taufe/Mirko & Marica", "Upiši naslov eventa": "Event-Titel eingeben", "Dodaj točno 6 bubble slika": "Füge genau 6 Bubble-Bilder hinzu", "Nisi prijavljen": "Du bist nicht angemeldet", "Kreiram event...": "Event wird erstellt...", "Greška kod kreiranja eventa": "Fehler beim Erstellen des Events", "Račun još nije odobren": "Das Konto wurde noch nicht freigegeben", "Pregled eventova": "Event-Übersicht", "Analitika, linkovi i upravljanje eventovima": "Analysen, Links und Eventverwaltung", "📊 Analitika": "📊 Analysen", "eventova u prikazu": "angezeigte Events", "Učitavanje eventova...": "Events werden geladen...", "✏️ Uredi event": "✏️ Event bearbeiten", "Detalji eventa": "Event-Details", "📋 Kopiraj event ID": "📋 Event-ID kopieren", "➕ Produži 30 dana": "➕ Um 30 Tage verlängern", "⏳ Označi expired": "⏳ Als abgelaufen markieren", "🧹 Označi očišćen": "🧹 Als bereinigt markieren", "Plan": "Paket", "Status": "Status", "Active": "Aktiv", "Expired": "Abgelaufen", "Disabled": "Deaktiviert", "Upload limit": "Upload-Limit", "Ističe": "Läuft ab", "Allow originals": "Originale erlauben", "📸 Slike": "📸 Fotos", "❤️ Lajkovi": "❤️ Likes", "💌 Posvete": "💌 Nachrichten", "Iskorištenost eventa": "Event-Auslastung", "Guest link": "Gast-Link", "App link": "App-Link", "Admin link": "Admin-Link", "📝 Textovi": "📝 Texte", "💾 Spremi promjene": "💾 Änderungen speichern", "Pregled svih eventova i iskorištenosti": "Übersicht aller Events und ihrer Auslastung", "Ukupno eventova": "Events gesamt", "Istekli / disabled": "Abgelaufen / deaktiviert", "Ukupno slika": "Fotos gesamt", "Ukupno lajkova": "Likes gesamt", "Ukupno posveta": "Nachrichten gesamt", "Iskorištenost limita": "Limit-Auslastung", "Najaktivniji organizator": "Aktivster Veranstalter", "Nema eventova": "Keine Events", "Event ne postoji": "Event existiert nicht", "Spremljeno ✅": "Gespeichert ✅", "Greška kod spremanja eventa.": "Fehler beim Speichern des Events.", "Event ID kopiran ✅": "Event-ID kopiert ✅", "Event produžen 30 dana ✅": "Event um 30 Tage verlängert ✅", "Označiti event kao expired?": "Dieses Event als abgelaufen markieren?", "Event označen kao expired ✅": "Event als abgelaufen markiert ✅", "Označiti event kao očišćen? Ovo ne briše Storage automatski.": "Event als bereinigt markieren? Dadurch werden Storage-Dateien nicht automatisch gelöscht.", "Event označen kao očišćen ✅": "Event als bereinigt markiert ✅", "Istekao": "Abgelaufen", "Još 1 dan": "Noch 1 Tag", "Korisnici": "Benutzer", "Upravljanje organizatorima i pristupima": "Veranstalter und Zugänge verwalten", "Pretraži po imenu ili emailu...": "Nach Name oder E-Mail suchen...", "Čekaju": "Ausstehend", "Odobreni": "Freigegeben", "Deaktivirani": "Deaktiviert", "Učitavanje korisnika...": "Benutzer werden geladen...", "Nema korisnika za prikaz.": "Keine Benutzer zum Anzeigen.", "Deaktiviran": "Deaktiviert", "Odobren": "Freigegeben", "Čeka odobrenje": "Wartet auf Freigabe", "Bez emaila": "Keine E-Mail", "Bez imena": "Kein Name", "Sigurno želiš ovom korisniku dati SUPERADMIN ovlasti?": "Möchtest du diesem Benutzer wirklich SUPERADMIN-Rechte geben?", "Greška kod promjene korisnika.": "Fehler beim Ändern des Benutzers.", "Račun nije odobren ili je deaktiviran": "Das Konto ist nicht freigegeben oder deaktiviert", "PhotoDump Event": "PhotoDump Event", "Otvaram tvoj event...": "Dein Event wird geöffnet...", "Odaberi event.": "Event auswählen.", "Upiši event ID ili zalijepi event link": "Event-ID eingeben oder Event-Link einfügen", "Upiši event ID ili zalijepi event link.": "Gib die Event-ID ein oder füge den Event-Link ein.", "Glavna navigacija": "Hauptnavigation", "Glavne prednosti": "Hauptvorteile", "Mobilni izbornik": "Mobiles Menü", "Nastavi skrolati": "Weiter scrollen", "Odaberi primjer teme": "Themenbeispiel auswählen", "Fotografija s eventa": "Event-Foto", "Fotografiraj": "Foto aufnehmen", "Prikaz slideshowa": "Diashow-Vorschau", "Scena 1": "Szene 1", "Scena 2": "Szene 2", "Scena 3": "Szene 3", "Scena 4": "Szene 4", "Scena 5": "Szene 5", "Scena 6": "Szene 6", "Scena 7": "Szene 7", "Scena 8": "Szene 8", "Index title": "Einstiegstitel", "Index subtitle": "Einstiegsuntertitel", "Upload title": "Upload-Titel", "Upload subtitle": "Upload-Untertitel", "Profile title": "Profil-Titel", "Profile subtitle": "Profil-Untertitel", "DEMO MODE": "DEMO-MODUS", "Demo fotografija": "Demo-Foto", "PhotoDumpEvent početna": "PhotoDumpEvent-Startseite", "QR kod": "QR-Code", "QR kod za demo": "Demo-QR-Code", "Slideshow fotografija": "Diashow-Foto", "Animirani prikaz PhotoDumpEvent aplikacije": "Animierte Vorschau der PhotoDumpEvent-App", "🎉 Party": "🎉 Party", "Demo prikaz: u pravoj aplikaciji ova posveta bi se spremila.": "Demo-Vorschau: In der echten App würde diese Nachricht gespeichert.", "Dobrodošao/la u demo galeriju. Ovo je prikaz bez spremanja podataka.": "Willkommen in der Demo-Galerie. Diese Vorschau speichert keine Daten.", "Dobrodošli na našu ljubavnu priču 💍": "Willkommen zu unserer Liebesgeschichte 💍", "Dobrodošli na ovaj sveti i poseban dan ✝️": "Willkommen zu diesem heiligen und besonderen Tag ✝️", "Dobrodošli na party 🔥": "Willkommen zur Party 🔥", "Dobrodošli na poseban dan naše male zvijezde ✨": "Willkommen zum besonderen Tag unseres kleinen Sterns ✨", "Dobrodošli na slavlje života 🎂": "Willkommen zur Feier des Lebens 🎂", "Dobrodošli u PhotoDump 📸": "Willkommen bei PhotoDump 📸", "Dodaj fotografiju i ostavi uspomenu za cijeli život 🤍": "Füge ein Foto hinzu und hinterlasse eine Erinnerung fürs Leben 🤍", "Dodaj najluđe i najbolje uspomene 🎉": "Füge die wildesten und schönsten Erinnerungen hinzu 🎉", "Dodajte svoje fotografije, lajkajte najljepše trenutke i ostavite posvetu.": "Fügt eure Fotos hinzu, liked die schönsten Momente und hinterlasst eine Nachricht.", "Event nije pronađen": "Event nicht gefunden", "Greška kod preuzimanja fotografije:": "Fehler beim Herunterladen des Fotos:", "Otvori galeriju, upiši svoje ime i dodaj fotografije s eventa.": "Öffne die Galerie, gib deinen Namen ein und füge Event-Fotos hinzu.", "Ovdje gost može napisati posvetu mladencima ili slavljeniku 💌": "Hier können Gäste dem Paar oder dem Jubilar eine Nachricht hinterlassen 💌", "Preporučeno preuzimanje preko laptopa/računala zbog veličine datoteke.": "Aufgrund der Dateigröße wird der Download über einen Laptop oder Computer empfohlen.", "Prvo kreiraj event.": "Erstelle zuerst ein Event.", "QR kod nije moguće preuzeti.": "Der QR-Code konnte nicht heruntergeladen werden.", "Sve uspomene bit će spremljene na jednom mjestu.": "Alle Erinnerungen werden an einem Ort gespeichert.", "Tvoje slike 🔥": "Deine Fotos 🔥", "U pravoj aplikaciji ovdje gost odabire jednu ili više fotografija iz galerije.": "In der echten App wählen Gäste hier ein oder mehrere Fotos aus ihrer Galerie aus.", "Uhvatite ljubav, sreću i zabavu 💍": "Haltet Liebe, Freude und Feier fest 💍", "Vaše uspomene 🤍": "Eure Erinnerungen 🤍", "Zabilježite ovaj sveti trenutak ✝️": "Haltet diesen heiligen Moment fest ✝️", "Šibaj slike, nema filtera 😎": "Fotos raus — ganz ohne Filter 😎", "⏳ Čeka odobrenje": "⏳ Wartet auf Freigabe"} };
  const GLOBAL_KEY = "pde_language";
  const EVENT_KEY_PREFIX = "pde_language_";
  const originals = new WeakMap();
  const rendered = new WeakMap();
  const attrOriginals = new WeakMap();
  let observer = null;
  let activeLanguage = "hr";

  function eventId() {
    return new URLSearchParams(location.search).get("event") ||
      localStorage.getItem("eventId") || "";
  }

  function normalizeLanguage(value) {
    const code = String(value || "").toLowerCase().slice(0, 2);
    return LANGUAGES[code] ? code : "";
  }

  function detectInitialLanguage() {
    const id = eventId();
    return (id && normalizeLanguage(localStorage.getItem(EVENT_KEY_PREFIX + id))) ||
      normalizeLanguage(localStorage.getItem(GLOBAL_KEY)) ||
      normalizeLanguage(navigator.language) ||
      "hr";
  }

  function pageType() {
    const explicit = document.body?.dataset.pdePage;
    if (explicit) return explicit;

    const path = location.pathname.toLowerCase().replace(/\/+$/, "");
    if (!path || path === "/" || path.endsWith("/index") || path.endsWith("/index.html")) {
      return "index";
    }
    if (document.getElementById("homeTab") && document.getElementById("secretAdminBtn")) {
      return "app";
    }
    if (document.getElementById("eventHeading") && document.getElementById("adminModal")) {
      return "event";
    }
    if (document.querySelector(".main-admin-page, .dashboard-page") || path.includes("main-admin")) {
      return "main-admin";
    }
    if (path.includes("pregled_event") || path.includes("pregled-event")) return "event-editor";
    if (path.includes("users")) return "users";
    if (path.includes("admin")) return "admin";
    if (path.includes("login")) return "login";
    if (path.includes("demo")) return "demo";
    if (path.includes("pwa-start")) return "pwa-start";
    return "other";
  }

  function pattern(source, lang) {
    if (lang === "hr") return source;
    const list = [
      [/^(\d+) fotki$/, "$1 photos", "$1 Fotos"],
      [/^(\d+) srca$/, "$1 likes", "$1 Herzen"],
      [/^(\d+) posveta$/, "$1 messages", "$1 Nachrichten"],
      [/^Pripremam (\d+) fotografija\.\.\.$/, "Preparing $1 photos...", "$1 Fotos werden vorbereitet..."],
      [/^Učitavam fotografije\.\.\. (\d+)\/(\d+)$/, "Uploading photos... $1/$2", "Fotos werden hochgeladen... $1/$2"],
      [/^Učitavam fotografiju (\d+)\/(\d+)\.\.\. (\d+)%$/, "Uploading photo $1/$2... $3%", "Foto $1/$2 wird hochgeladen... $3%"],
      [/^Upload završen — (\d+) uspješno, (\d+) nije uspjelo$/, "Upload complete — $1 successful, $2 failed", "Upload abgeschlossen — $1 erfolgreich, $2 fehlgeschlagen"],
      [/^Odabrano slika: (\d+)\/6$/, "Selected images: $1/6", "Ausgewählte Bilder: $1/6"],
      [/^Još (\d+) dana$/, "$1 days remaining", "Noch $1 Tage"],
      [/^Istekao prije (\d+) dana$/, "Expired $1 days ago", "Vor $1 Tagen abgelaufen"],
      [/^Fotografija gosta · (.+)$/, "Guest photo · $1", "Gästefoto · $1"],
      [/^Deaktivirati korisnika (.+)\?$/, "Disable user $1?", "Benutzer $1 deaktivieren?"]
    ];

    for (const [regex, en, de] of list) {
      if (regex.test(source)) return source.replace(regex, lang === "en" ? en : de);
    }
    return source;
  }

  function tr(source) {
    if (source == null) return source;
    const text = String(source);
    if (activeLanguage === "hr") return text;
    return TRANSLATIONS[activeLanguage]?.[text] || pattern(text, activeLanguage);
  }

  function skip(node) {
    const parent = node.parentElement;
    if (!parent) return true;
    return Boolean(parent.closest(
      "script,style,code,pre,svg,[data-i18n-ignore],#eventTitle,#eventHeading,#eventSubtitle,#dedicationsList,.dedication-card,.user-card .owner,.event-card .event-title,.event-card .owner"
    ));
  }

  function translateText(node) {
    if (skip(node)) return;
    const current = node.nodeValue;
    const last = rendered.get(node);
    if (!originals.has(node) || (last != null && current !== last)) originals.set(node, current);

    const original = originals.get(node);
    const lead = original.match(/^\s*/)?.[0] || "";
    const trail = original.match(/\s*$/)?.[0] || "";
    const core = original.trim();

    if (!core || !/[A-Za-zÀ-ž]/.test(core)) {
      rendered.set(node, current);
      return;
    }

    const next = lead + tr(core) + trail;
    rendered.set(node, next);
    if (current !== next) node.nodeValue = next;
  }

  function translateAttrs(element) {
    if (!(element instanceof Element) || element.closest("[data-i18n-ignore]")) return;
    let map = attrOriginals.get(element);
    if (!map) {
      map = {};
      attrOriginals.set(element, map);
    }

    for (const attribute of ["placeholder", "title", "aria-label", "alt"]) {
      if (!element.hasAttribute(attribute)) continue;
      if (!(attribute in map)) map[attribute] = element.getAttribute(attribute);
      element.setAttribute(attribute, tr(map[attribute]));
    }
  }

  function translate(root) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) {
      translateText(root);
      return;
    }
    if (root instanceof Element) translateAttrs(root);
    if (!(root instanceof Element) && root !== document) return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    let node = walker.currentNode;
    while (node) {
      if (node.nodeType === Node.TEXT_NODE) translateText(node);
      else if (node instanceof Element) translateAttrs(node);
      node = walker.nextNode();
    }
  }

  function updateControls() {
    const current = LANGUAGES[activeLanguage];

    document.querySelectorAll(".pde-language-switcher").forEach((switcher) => {
      const flag = switcher.querySelector(".pde-language-current-flag");
      const code = switcher.querySelector(".pde-language-current-code");
      if (flag) {
        flag.src = current.flag;
        flag.alt = current.label;
      }
      if (code) code.textContent = current.code;
      switcher.querySelectorAll("[data-language]").forEach((option) => {
        const selected = option.dataset.language === activeLanguage;
        option.classList.toggle("is-selected", selected);
        option.setAttribute("aria-selected", String(selected));
      });
    });

    document.querySelectorAll(".pde-app-header-menu").forEach((menu) => {
      const flag = menu.querySelector(".pde-app-language-current-flag");
      const code = menu.querySelector(".pde-app-language-current-code");
      if (flag) {
        flag.src = current.flag;
        flag.alt = current.label;
      }
      if (code) code.textContent = current.code;
      menu.querySelectorAll(".pde-app-language-option").forEach((option) => {
        const selected = option.dataset.language === activeLanguage;
        option.classList.toggle("is-selected", selected);
        option.setAttribute("aria-selected", String(selected));
      });
    });
  }

  function setLanguage(language, options = {}) {
    activeLanguage = normalizeLanguage(language) || "hr";
    document.documentElement.lang = activeLanguage;

    if (options.persist !== false) {
      localStorage.setItem(GLOBAL_KEY, activeLanguage);
      const id = eventId();
      if (id) localStorage.setItem(EVENT_KEY_PREFIX + id, activeLanguage);
    }

    translate(document);
    updateControls();
    document.dispatchEvent(new CustomEvent("pde:languagechange", {
      detail: { language: activeLanguage }
    }));
  }

  function createSwitcher(options = {}) {
    const compact = options.compact !== false;
    const wrapper = document.createElement("div");
    wrapper.className = "pde-language-switcher " + (compact ? "is-compact" : "is-menu");
    wrapper.innerHTML = `
      <button type="button" class="pde-language-current" aria-haspopup="listbox" aria-expanded="false">
        <img class="pde-language-current-flag" alt="">
        <span class="pde-language-current-code"></span>
        <svg class="pde-language-chevron" viewBox="0 0 20 20" aria-hidden="true">
          <path d="m5 12 5-5 5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="pde-language-dropdown" role="listbox"></div>`;

    const dropdown = wrapper.querySelector(".pde-language-dropdown");
    const button = wrapper.querySelector(".pde-language-current");

    Object.entries(LANGUAGES).forEach(([code, language]) => {
      const option = document.createElement("button");
      option.type = "button";
      option.className = "pde-language-option";
      option.dataset.language = code;
      option.setAttribute("role", "option");
      option.innerHTML = `
        <img src="${language.flag}" alt="">
        <span class="pde-language-option-copy">
          <strong>${language.label}</strong>
          <small>${language.code}</small>
        </span>
        <span class="pde-language-check">✓</span>`;
      dropdown.appendChild(option);
    });

    const close = () => {
      wrapper.classList.remove("is-open");
      button.setAttribute("aria-expanded", "false");
    };

    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const open = wrapper.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(open));
    });

    dropdown.addEventListener("click", (event) => {
      const option = event.target.closest("[data-language]");
      if (!option) return;
      setLanguage(option.dataset.language);
      close();
    });

    document.addEventListener("click", (event) => {
      if (!wrapper.contains(event.target)) close();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });

    return wrapper;
  }

  function setupAppMenu(type) {
    const button = document.getElementById("pdeAppMenuButton");
    if (!button || document.getElementById("pdeAppHeaderMenu")) return;

    const backdrop = document.createElement("div");
    backdrop.id = "pdeAppMenuBackdrop";
    backdrop.className = "pde-app-menu-backdrop";

    const panel = document.createElement("aside");
    panel.id = "pdeAppHeaderMenu";
    panel.className = "pde-app-header-menu";
    panel.setAttribute("aria-hidden", "true");
    panel.innerHTML = `
      <div class="pde-app-menu-head">
        <strong>Izbornik</strong>
        <button type="button" class="pde-app-menu-close" aria-label="Zatvori izbornik">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
      </div>

      <button type="button" class="pde-app-menu-action" data-pde-admin-open>
        <span class="pde-app-menu-icon" aria-hidden="true">⚙</span>
        <span>Moderator panel</span>
      </button>

      <button type="button" class="pde-app-menu-action pde-app-language-toggle" aria-expanded="false">
        <span class="pde-app-language-current-wrap">
          <img class="pde-app-language-current-flag" alt="">
        </span>
        <span class="pde-app-menu-action-copy">
          <span>Jezik</span>
          <small class="pde-app-language-current-code"></small>
        </span>
        <svg class="pde-app-language-arrow" viewBox="0 0 20 20" aria-hidden="true">
          <path d="m5 8 5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <div class="pde-app-language-submenu" role="listbox" aria-label="Jezik"></div>

      ${type === "app" ? `
      <button type="button" class="pde-app-menu-action" data-pde-tutorial-open>
        <span class="pde-app-menu-icon" aria-hidden="true">?</span>
        <span>Kako radi</span>
      </button>` : ""}

      <button type="button" class="pde-app-menu-action" data-install-open>
        <span class="pde-app-menu-icon" aria-hidden="true">⇩</span>
        <span>Instaliraj aplikaciju</span>
      </button>`;

    const submenu = panel.querySelector(".pde-app-language-submenu");
    Object.entries(LANGUAGES).forEach(([code, language]) => {
      const option = document.createElement("button");
      option.type = "button";
      option.className = "pde-app-language-option";
      option.dataset.language = code;
      option.setAttribute("role", "option");
      option.innerHTML = `
        <img src="${language.flag}" alt="">
        <span><strong>${language.label}</strong><small>${language.code}</small></span>
        <i aria-hidden="true">✓</i>`;
      submenu.appendChild(option);
    });

    document.body.append(backdrop, panel);

    const close = () => {
      panel.classList.remove("is-open", "is-language-open");
      backdrop.classList.remove("is-open");
      button.classList.remove("is-open");
      button.setAttribute("aria-expanded", "false");
      panel.setAttribute("aria-hidden", "true");
      panel.querySelector(".pde-app-language-toggle")?.setAttribute("aria-expanded", "false");
      document.body.classList.remove("pde-app-menu-lock");
    };

    const open = () => {
      panel.classList.add("is-open");
      backdrop.classList.add("is-open");
      button.classList.add("is-open");
      button.setAttribute("aria-expanded", "true");
      panel.setAttribute("aria-hidden", "false");
      document.body.classList.add("pde-app-menu-lock");
      updateControls();
    };

    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      panel.classList.contains("is-open") ? close() : open();
    });

    panel.querySelector(".pde-app-menu-close")?.addEventListener("click", close);
    backdrop.addEventListener("click", close);

    panel.querySelector("[data-pde-admin-open]")?.addEventListener("click", () => {
      close();
      if (type === "event") window.openAdminModal?.();
      else document.getElementById("secretAdminBtn")?.click();
    });

    panel.querySelector("[data-pde-tutorial-open]")?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      close();
      window.startPhotoDumpTutorial?.({ force: true });
    });

    panel.querySelector("[data-install-open]")?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      close();
      window.openPhotoDumpInstallHelp?.();
    });

    panel.querySelector(".pde-app-language-toggle")?.addEventListener("click", () => {
      const languageOpen = panel.classList.toggle("is-language-open");
      panel.querySelector(".pde-app-language-toggle")?.setAttribute("aria-expanded", String(languageOpen));
    });

    submenu.addEventListener("click", (event) => {
      const option = event.target.closest("[data-language]");
      if (!option) return;
      setLanguage(option.dataset.language);
      panel.classList.remove("is-language-open");
      panel.querySelector(".pde-app-language-toggle")?.setAttribute("aria-expanded", "false");
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });
  }

  function mountIndexLanguage() {
    const desktopActions = document.querySelector(".desktop-actions");
    if (desktopActions && !desktopActions.querySelector(".pde-language-switcher")) {
      const switcher = createSwitcher({ compact: true });
      switcher.classList.add("pde-index-language");
      desktopActions.prepend(switcher);
    }

    const mobileMenu = document.getElementById("mobileMenu");
    if (mobileMenu && !mobileMenu.querySelector(".pde-language-switcher")) {
      const switcher = createSwitcher({ compact: false });
      switcher.classList.add("pde-index-mobile-language");
      const installButton = mobileMenu.querySelector("[data-install-open]");
      if (installButton) mobileMenu.insertBefore(switcher, installButton);
      else mobileMenu.appendChild(switcher);
    }
  }

  function mount() {
    const type = pageType();

    if (type === "index") {
      mountIndexLanguage();
      return;
    }

    if (type === "event" || type === "app") {
      setupAppMenu(type);
      return;
    }

    if (type === "main-admin") {
      const toolbar = document.querySelector(".toolbar-right");
      if (toolbar) {
        const switcher = createSwitcher();
        switcher.classList.add("pde-language-inline");
        toolbar.prepend(switcher);
      }
      return;
    }

    if (type === "event-editor") {
      const toolbar = document.querySelector(".topbar-actions");
      if (toolbar) {
        const switcher = createSwitcher();
        switcher.classList.add("pde-language-inline");
        toolbar.prepend(switcher);
      }
      return;
    }

    if (type === "users") {
      const toolbar = document.querySelector(".users-topbar");
      if (toolbar) {
        const switcher = createSwitcher();
        switcher.classList.add("pde-language-inline");
        toolbar.insertBefore(switcher, toolbar.lastElementChild);
      }
      return;
    }

    // Moderator panel inherits the language selected in the main app.
    // Both pages run on the same origin, so pde_language / pde_language_<eventId>
    // are available here without a second visible selector.
    if (type === "admin") return;

    const switcher = createSwitcher();
    switcher.classList.add("pde-language-floating");
    document.body.appendChild(switcher);
  }

  function patchDialogs() {
    if (window.__pdeDialogsPatched) return;
    window.__pdeDialogsPatched = true;
    const nativeAlert = window.alert.bind(window);
    const nativeConfirm = window.confirm.bind(window);
    const nativePrompt = window.prompt.bind(window);
    window.alert = (message) => nativeAlert(tr(message));
    window.confirm = (message) => nativeConfirm(tr(message));
    window.prompt = (message, value) => nativePrompt(tr(message), value);
  }

  function init() {
    activeLanguage = detectInitialLanguage();
    patchDialogs();
    mount();
    setLanguage(activeLanguage, { persist: false });

    observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "characterData") translate(mutation.target);
        else mutation.addedNodes.forEach(translate);
      });
    });
    observer.observe(document.body, { childList: true, characterData: true, subtree: true });
  }

  window.PDE_I18N = {
    languages: LANGUAGES,
    tr,
    getLanguage: () => activeLanguage,
    setLanguage,
    createLanguageSwitcher: createSwitcher,
    translateElement: translate
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
