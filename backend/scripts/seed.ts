import mongoose from 'mongoose';
import { config } from 'dotenv';
import { Site, SiteSchema } from '../src/sites/schemas/site.schema.js';
import { Person, PersonSchema } from '../src/people/schemas/person.schema.js';
import { Visit, VisitSchema } from '../src/visits/schemas/visit.schema.js';
import dns from 'node:dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);
config();

const PEOPLE = ['Ava', 'Ben', 'Cleo', 'Dax', 'Eli'];

const SITES = [
  {
    address: 'tidepool.zz',
    author: 'Ava',
    title: 'Tidepool',
    html: `<h1>Tidepool</h1><p>Every low tide leaves the same six pools behind the reef, and I've been writing down what's in them since March. Yesterday: two hermit crabs fighting over a shell neither of them fit.</p><p>More of my notes live at <a href="lighthouse.zz">lighthouse.zz</a>. I keep meaning to link to <a href="driftnet.zz">driftnet.zz</a> but I've never found it again.</p>`,
  },
  {
    address: 'lighthouse.zz',
    author: 'Ava',
    title: 'The Lighthouse Keeper Quit',
    html: `<h1>The Lighthouse Keeper Quit</h1><p>Nobody's replaced her. The light still turns because it's on a timer now, which feels like a small betrayal of the whole idea of a lighthouse keeper.</p><p>Back to <a href="tidepool.zz">tidepool.zz</a>, or onward to <a href="driftwood.zz">driftwood.zz</a>.</p>`,
  },
  {
    address: 'driftwood.zz',
    author: 'Ben',
    title: 'Driftwood Inventory',
    html: `<h1>Driftwood Inventory</h1><p>I collect it, I don't build anything with it, I just have a lot of driftwood now. Forty-one pieces as of this morning.</p><p>My other page is <a href="saltmarsh.zz">saltmarsh.zz</a>. See also <a href="kelp.zz">kelp.zz</a>.</p>`,
  },
  {
    address: 'saltmarsh.zz',
    author: 'Ben',
    title: 'Saltmarsh Field Notes',
    html: `<h1>Saltmarsh Field Notes</h1><p>The marsh floods twice a day and nobody who doesn't live here believes that until they've watched it happen.</p><p>Related: <a href="estuary.zz">estuary.zz</a> and <a href="atlantis.zz">atlantis.zz</a>, if it still exists.</p>`,
  },
  {
    address: 'kelp.zz',
    author: 'Cleo',
    title: 'Kelp Forest Diary',
    html: `<h1>Kelp Forest Diary</h1><p>Giant kelp grows up to two feet a day in good conditions. I did not believe this until I measured it myself, badly, with a tape measure and a snorkel.</p><p>More from me at <a href="shoreline.zz">shoreline.zz</a>. Also try <a href="barnacle.zz">barnacle.zz</a>.</p>`,
  },
  {
    address: 'barnacle.zz',
    author: 'Dax',
    title: 'A Defense of Barnacles',
    html: `<h1>A Defense of Barnacles</h1><p>Everyone thinks they're just crusty rocks. They're crustaceans standing on their heads, kicking food into their mouths with their legs, for life. Respect them.</p><p>Also mine: <a href="estuary.zz">estuary.zz</a>.</p>`,
  },
  {
    address: 'current.zz',
    author: 'Eli',
    title: 'Reading the Current',
    html: `<h1>Reading the Current</h1><p>You can tell which way the current runs by watching where the loose kelp drifts, not by looking at the surface chop, which lies constantly.</p><p>Next: <a href="reef.zz">reef.zz</a> or back to <a href="kelp.zz">kelp.zz</a>.</p>`,
  },
  {
    address: 'shoreline.zz',
    author: 'Cleo',
    title: 'Shoreline Erosion, Slowly',
    html: `<h1>Shoreline Erosion, Slowly</h1><p>The point lost about a meter of sand this winter. You can't see it happen, only that it happened, which is most erosion stories.</p><p>See <a href="tidepool.zz">tidepool.zz</a> and <a href="lostcove.zz">lostcove.zz</a>.</p>`,
  },
  {
    address: 'estuary.zz',
    author: 'Dax',
    title: 'Where the River Gives Up',
    html: `<h1>Where the River Gives Up</h1><p>Fresh water and salt water don't mix so much as argue, and the estuary is where the argument happens.</p><p>Onward to <a href="current.zz">current.zz</a> or <a href="reef.zz">reef.zz</a>.</p>`,
  },
  {
    address: 'reef.zz',
    author: 'Eli',
    title: 'The Reef at Night',
    html: `<h1>The Reef at Night</h1><p>Everything that hides during the day comes out after dark, and the reef becomes a completely different, much louder place.</p><p>Back to <a href="driftwood.zz">driftwood.zz</a> or start over at <a href="tidepool.zz">tidepool.zz</a>.</p>`,
  },
];

// Deterministic base timestamp — not "now", so reseeding produces identical data.
const BASE = new Date('2026-01-01T12:00:00Z').getTime();
const min = (n: number) => n * 60 * 1000;

const VISITS: {
  person: string;
  address: string;
  arrivedVia: 'typed' | 'link' | 'back' | 'forward' | 'history';
  offset: number;
}[] = [
  // Eli: a long trail touching nearly every site
  {
    person: 'Eli',
    address: 'tidepool.zz',
    arrivedVia: 'typed',
    offset: min(0),
  },
  {
    person: 'Eli',
    address: 'lighthouse.zz',
    arrivedVia: 'link',
    offset: min(2),
  },
  {
    person: 'Eli',
    address: 'driftwood.zz',
    arrivedVia: 'link',
    offset: min(4),
  },
  {
    person: 'Eli',
    address: 'saltmarsh.zz',
    arrivedVia: 'link',
    offset: min(6),
  },
  { person: 'Eli', address: 'estuary.zz', arrivedVia: 'link', offset: min(9) },
  { person: 'Eli', address: 'current.zz', arrivedVia: 'link', offset: min(11) },
  { person: 'Eli', address: 'reef.zz', arrivedVia: 'link', offset: min(13) },
  { person: 'Eli', address: 'kelp.zz', arrivedVia: 'typed', offset: min(20) },
  {
    person: 'Eli',
    address: 'barnacle.zz',
    arrivedVia: 'link',
    offset: min(22),
  },
  {
    person: 'Eli',
    address: 'shoreline.zz',
    arrivedVia: 'typed',
    offset: min(35),
  },

  // Ava: repeat visits to her own pages
  {
    person: 'Ava',
    address: 'tidepool.zz',
    arrivedVia: 'typed',
    offset: min(1),
  },
  {
    person: 'Ava',
    address: 'lighthouse.zz',
    arrivedVia: 'link',
    offset: min(3),
  },
  { person: 'Ava', address: 'tidepool.zz', arrivedVia: 'back', offset: min(5) },
  {
    person: 'Ava',
    address: 'lighthouse.zz',
    arrivedVia: 'forward',
    offset: min(7),
  },
  {
    person: 'Ava',
    address: 'tidepool.zz',
    arrivedVia: 'typed',
    offset: min(45),
  },

  // Ben: a shorter linked trail
  {
    person: 'Ben',
    address: 'driftwood.zz',
    arrivedVia: 'typed',
    offset: min(10),
  },
  {
    person: 'Ben',
    address: 'saltmarsh.zz',
    arrivedVia: 'link',
    offset: min(12),
  },
  { person: 'Ben', address: 'kelp.zz', arrivedVia: 'link', offset: min(14) },
  {
    person: 'Ben',
    address: 'shoreline.zz',
    arrivedVia: 'link',
    offset: min(16),
  },

  // Cleo: sparse browsing
  { person: 'Cleo', address: 'kelp.zz', arrivedVia: 'typed', offset: min(25) },
  {
    person: 'Cleo',
    address: 'barnacle.zz',
    arrivedVia: 'link',
    offset: min(27),
  },
  {
    person: 'Cleo',
    address: 'kelp.zz',
    arrivedVia: 'history',
    offset: min(50),
  },

  // Dax: sparse browsing
  {
    person: 'Dax',
    address: 'barnacle.zz',
    arrivedVia: 'typed',
    offset: min(30),
  },
  { person: 'Dax', address: 'estuary.zz', arrivedVia: 'link', offset: min(32) },
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set');

  await mongoose.connect(uri);
  const SiteModel = mongoose.model(Site.name, SiteSchema);
  const PersonModel = mongoose.model(Person.name, PersonSchema);
  const VisitModel = mongoose.model(Visit.name, VisitSchema);

  // Wipe and reinsert — deterministic and idempotent by construction.
  await Promise.all([
    SiteModel.deleteMany({}),
    PersonModel.deleteMany({}),
    VisitModel.deleteMany({}),
  ]);

  await PersonModel.insertMany(PEOPLE.map((name) => ({ name })));
  await SiteModel.insertMany(SITES);
  await VisitModel.insertMany(
    VISITS.map((v) => ({
      person: v.person,
      address: v.address,
      arrivedVia: v.arrivedVia,
      visitedAt: new Date(BASE + v.offset),
    })),
  );

  console.log(
    `Seeded ${SITES.length} sites, ${PEOPLE.length} people, ${VISITS.length} visits.`,
  );
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
