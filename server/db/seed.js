'use strict';

/**
 * Pustakalaya DB setup + seed.
 * Runs server/db/schema.sql (drops + recreates tables) and inserts sample
 * data that mirrors the content previously hardcoded in the frontend HTML.
 *
 *   npm run seed
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

const ADMINS = [
  {
    username: 'archivist@library.dev',
    name: 'Archivist Smith',
    password: 'archivist123',
  },
];

const AUTHORS = [
  {
    name: 'Alistair Vane',
    specialty: 'High Archivist, Dream Cartography',
    bio: 'Scribe of the last surviving atlas of the Dreamlands. Scholars believe he did not write these words, but rather listened to them.',
  },
  {
    name: 'Sylas Vane',
    specialty: 'Glyph-Lore',
    bio: 'Compiler of the Emerald Lexicon and keeper of the forest tribes\u2019 glyph traditions.',
  },
  {
    name: 'Eleanor Thorne',
    specialty: 'Shire Histories & Sylvan Botany',
    bio: 'Wandering chronicler of the shires, her fieldwork notes are scented with marsh mint and suspicion.',
  },
  {
    name: 'Dr. Alistair Moone',
    specialty: 'Celestial Mechanics',
    bio: 'An eccentric astronomer whose prose reflects the chaotic beauty of the cosmos.',
  },
  {
    name: 'Seraphina Thorne',
    specialty: 'Victorian Necromancy',
    bio: 'Pioneered the \u2018Ghost-Ink\u2019 technique in the late 19th century. Her manuscripts are famously readable only by candlelight.',
  },
  {
    name: 'Alaric Vane',
    specialty: 'Celestial Navigation',
    bio: 'An eccentric astronomer whose biography is largely written in starlight charts.',
  },
  {
    name: 'Caspian Wren',
    specialty: 'Romantic Verse',
    bio: 'Court minstrel turned librarian, author of lamentations bound in pressed rose petals.',
  },
  {
    name: 'Isadora Vale',
    specialty: 'Occult Detection',
    bio: 'Former inspector of the Crescent Constabulary; now documents unsolved hauntings in the halls.',
  },
];

const GENRES = [
  {
    name: 'Esoteric Geography',
    description: 'Atlases, dream-terrains, and the shifting borders of impossible lands.',
    shelf_location: 'West Wing - G2',
  },
  {
    name: 'Fantasy',
    description: 'Tales of enchanted realms, dragon courts, and far-flung kingdoms.',
    shelf_location: 'East Wing - G1',
  },
  {
    name: 'Lore',
    description: 'Oral histories, folktales, and the deep chronicles of the shires.',
    shelf_location: 'East Wing - G3',
  },
  {
    name: 'Science',
    description: 'Observations of the firmament, alchemy, and mechanical wonders.',
    shelf_location: 'Observatory - O1',
  },
  {
    name: 'Poetry',
    description: 'Verses, sonnets, and incantations written in meter.',
    shelf_location: 'West Wing - G5',
  },
  {
    name: 'Mystery',
    description: 'Cold cases, locked rooms, and affairs of the unseen court.',
    shelf_location: 'Basement - B1',
  },
  {
    name: 'Romance',
    description: 'Correspondence, courtship rituals, and ill-fated loves.',
    shelf_location: 'West Wing - G6',
  },
  {
    name: 'Arcane Arts',
    description: 'Practical magic, sigil-craft, and the sanctioned schools of sorcery.',
    shelf_location: 'East Wing - G4',
  },
  {
    name: 'Natural Science',
    description: 'Sentient flora, bestiaries, and the curative powers of ancient groves.',
    shelf_location: 'Glasshouse - S1',
  },
  {
    name: 'Dark Arts',
    description: 'Forbidden grimoires kept under triple lock and royal seal.',
    shelf_location: 'Basement - B2',
  },
  {
    name: 'Arcane History',
    description: 'The study of magical events and the chronologies of the unseen world.',
    shelf_location: 'East Wing - G4',
  },
  {
    name: 'Sylvan Botany',
    description: 'Compendiums on sentient flora and the curative powers of ancient groves.',
    shelf_location: 'Glasshouse - S1',
  },
  {
    name: 'Gothic Architecture',
    description: 'Analysis of stone-born enchantments and the blueprints of legendary fortresses.',
    shelf_location: 'Basement - B2',
  },
];

const BOOKS = [
  {
    title: 'The Cartography of Whispers',
    author: 'Alistair Vane',
    genre: 'Esoteric Geography',
    isbn: '978-1892000019',
    archiveRef: 'CL-1892-BX',
    publishedYear: 1892,
    totalCopies: 4,
    availableCopies: 3,
    condition: 'Fragile (Level 4)',
    restoration: 'Lanolin Treatment (1956)',
    lowStockThreshold: 3,
    coverImageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBhwML8MA8ZwXtjjZM8uMQtyrhqV5_i1u1A5Hhuw1XKoRTKrMyEckUkUx7fS68Ia7Naixm5o5fEJRllXEkZt182j7CJzF_iQoaVfXsAJDyh-_V1X5HsSUir3VqiGjM80fgrySoY9H8EV-KOWitzs7aUBih3Bye7oK-3bbu8EgfAoY2Xk4y4J-jfsIenLIS5_TuGRUOkKEKP0MaRwPjlZBVNN8MKF8fmVE3S5dp-ylu3KUAEj8VEb83_6BJNzfOuaFPSi8sz4a8RRQ',
    description:
      'Recovered from the flooded remains of the Crescent Observatory in 1892, this volume remains the only comprehensive guide to the shifting borders of the Dreamlands. Every page is hand-vellum and infused with a low-level resonance that allows the ink to remain visible even in total darkness.\n\nScholars believe Alistair Vane did not write these words, but rather listened to them. The text describes landscapes that no longer exist and stars that have never been seen by the waking eye. Note the coffee stains on page 412\u2014bequeathed by the original curator who reportedly vanished while studying the central fold-out map.',
  },
  {
    title: 'The Emerald Lexicon',
    author: 'Sylas Vane',
    genre: 'Fantasy',
    isbn: '978-1892000026',
    archiveRef: 'CL-1842-EM',
    publishedYear: 1842,
    totalCopies: 3,
    availableCopies: 1,
    condition: 'Good',
    restoration: null,
    lowStockThreshold: 3,
    coverImageUrl: null,
    description:
      'A complete directory of all known magical glyphs used by the ancient forest-dwelling tribes. Contains full descriptions of emerald stones, their uses in ward-craft, and the dangers of mispronouncing the high runes.',
  },
  {
    title: 'Shadows of the Shire',
    author: 'Eleanor Thorne',
    genre: 'Lore',
    isbn: '978-1892000033',
    archiveRef: 'CL-1899-SH',
    publishedYear: 1899,
    totalCopies: 2,
    availableCopies: 2,
    condition: 'Good',
    restoration: null,
    lowStockThreshold: 1,
    coverImageUrl: null,
    description:
      'An oral history of the shires compiled over a decade of harvest-season wanderings. Records the folk tales of will-o\u2019-the-wisps, standing stones, and the occasional sheep-stealing bog spirit.',
  },
  {
    title: 'Celestial Mechanics',
    author: 'Dr. Alistair Moone',
    genre: 'Science',
    isbn: '978-1892000040',
    archiveRef: 'CL-1902-CM',
    publishedYear: 1902,
    totalCopies: 5,
    availableCopies: 4,
    condition: 'Excellent',
    restoration: null,
    lowStockThreshold: 2,
    coverImageUrl: null,
    description:
      'The definitive treatise on the motions of the seven visible spheres and the mathematics of cometary apparitions, annotated in the margins by three generations of observatory curators.',
  },
  {
    title: 'The Alchemist\u2019s Ledger',
    author: 'Seraphina Thorne',
    genre: 'Arcane Arts',
    isbn: '978-1892000057',
    archiveRef: 'CL-1885-AL',
    publishedYear: 1885,
    totalCopies: 7,
    availableCopies: 7,
    condition: 'Excellent',
    restoration: null,
    lowStockThreshold: 3,
    coverImageUrl: null,
    description:
      'A year of transmutation experiments recorded in copperplate, including the celebrated recipe for Ghost-Ink and several regrettable attempts at candle-snuff intelligence.',
  },
  {
    title: 'Whispers of the Astral Cartographer',
    author: 'Alaric Vane',
    genre: 'Poetry',
    isbn: '978-1892000064',
    archiveRef: 'CL-1901-WA',
    publishedYear: 1901,
    totalCopies: 1,
    availableCopies: 1,
    condition: 'Fragile (Level 5)',
    restoration: 'Silk Binding (1922)',
    lowStockThreshold: 2,
    coverImageUrl: null,
    description:
      'A single folio of verse written in starlight charts. The poems shift slightly between readings; the constellations rearrange themselves depending on the season.',
  },
  {
    title: 'The Verdant Grimoire',
    author: 'Eleanor Thorne',
    genre: 'Natural Science',
    isbn: '978-1892000071',
    archiveRef: 'CL-1877-VG',
    publishedYear: 1877,
    totalCopies: 6,
    availableCopies: 2,
    condition: 'Good',
    restoration: null,
    lowStockThreshold: 3,
    coverImageUrl: null,
    description:
      'A pressed-leaf compendium of sentient flora. The chapters rearrange themselves when the humidity rises, so readers are advised to keep it sealed in a dry reading room.',
  },
  {
    title: 'A Midnight Serenade',
    author: 'Caspian Wren',
    genre: 'Romance',
    isbn: '978-1892000088',
    archiveRef: 'CL-1896-MS',
    publishedYear: 1896,
    totalCopies: 4,
    availableCopies: 4,
    condition: 'Excellent',
    restoration: null,
    lowStockThreshold: 2,
    coverImageUrl: null,
    description:
      'A cycle of love letters to a lighthouse keeper who never answered. Bound in pressed rose petals; the final page is reported to hum when held to the light.',
  },
  {
    title: 'The Case of the Whispering Hall',
    author: 'Isadora Vale',
    genre: 'Mystery',
    isbn: '978-1892000095',
    archiveRef: 'CL-1910-CW',
    publishedYear: 1910,
    totalCopies: 3,
    availableCopies: 0,
    condition: 'Good',
    restoration: null,
    lowStockThreshold: 2,
    coverImageUrl: null,
    description:
      'The unsolved disappearance of a reading-room attendant, whose voice was last heard repeating the Dewey numbers backwards. All three copies are currently held by the police archives.',
  },
  {
    title: 'Maledictions of the Pale Moon',
    author: 'Seraphina Thorne',
    genre: 'Dark Arts',
    isbn: '978-1892000101',
    archiveRef: 'CL-1888-MP',
    publishedYear: 1888,
    totalCopies: 2,
    availableCopies: 2,
    condition: 'Fragile (Level 3)',
    restoration: null,
    lowStockThreshold: 1,
    coverImageUrl: null,
    description:
      'Kept under triple lock. Charts the minor curses associated with the phases of the pale moon. Reading any page aloud in the basement is strictly forbidden by Order policy.',
  },
];

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number.parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  });

  try {
    console.log('\n→ Applying schema (drops + recreates tables)…');
    await connection.query(schemaSql);

    console.log(`→ Seeding ${AUTHORS.length} authors…`);
    const authorIds = {};
    for (const author of AUTHORS) {
      const [result] = await connection.execute(
        'INSERT INTO authors (name, bio, specialty) VALUES (?, ?, ?)',
        [author.name, author.bio, author.specialty],
      );
      authorIds[author.name] = result.insertId;
    }

    console.log(`→ Seeding ${GENRES.length} genres…`);
    const genreIds = {};
    for (const genre of GENRES) {
      const [result] = await connection.execute(
        'INSERT INTO genres (name, description, shelf_location) VALUES (?, ?, ?)',
        [genre.name, genre.description, genre.shelf_location],
      );
      genreIds[genre.name] = result.insertId;
    }

    console.log(`→ Seeding ${BOOKS.length} books…`);
    for (const book of BOOKS) {
      if (!authorIds[book.author]) {
        throw new Error(`Seed data references unknown author: ${book.author}`);
      }
      if (!genreIds[book.genre]) {
        throw new Error(`Seed data references unknown genre: ${book.genre}`);
      }
      await connection.execute(
        `INSERT INTO books
           (title, author_id, genre_id, isbn, archive_ref, description,
            cover_image_url, published_year, total_copies, available_copies,
            condition_level, restoration_log, low_stock_threshold)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          book.title,
          authorIds[book.author],
          genreIds[book.genre],
          book.isbn,
          book.archiveRef,
          book.description,
          book.coverImageUrl,
          book.publishedYear,
          book.totalCopies,
          book.availableCopies,
          book.condition,
          book.restoration,
          book.lowStockThreshold,
        ],
      );
    }

    console.log(`→ Seeding ${ADMINS.length} admin account(s)…`);
    for (const admin of ADMINS) {
      const passwordHash = await bcrypt.hash(admin.password, 12);
      await connection.execute(
        'INSERT INTO admins (username, name, password_hash) VALUES (?, ?, ?)',
        [admin.username, admin.name, passwordHash],
      );
    }

    console.log('\n✔ Database seeded successfully.\n');
    console.log('  Admin login (see README):');
    console.log(`    identity: ${ADMINS[0].username}`);
    console.log(`    cypher:   ${ADMINS[0].password}\n`);
  } catch (error) {
    console.error('\n✘ Seed failed:', error.message);
    process.exitCode = 1;
  } finally {
    await connection.end();
  }
}

main();
