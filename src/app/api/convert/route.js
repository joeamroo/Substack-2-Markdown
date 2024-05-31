import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import archiver from 'archiver';

const execAsync = promisify(exec);

export async function POST(request) {
  const { url, convertAll } = await request.json();
  const scriptPath = path.join(process.cwd(), 'substack-2-markdown.py');

  if (convertAll) {
    const outputDir = '/tmp/articles';
    const zipPath = '/tmp/articles.zip';

    try {
      // Run the script to convert all articles
      await execAsync(`python3 ${scriptPath} --all "${url}" "${outputDir}"`);

      // Create a zip file of the articles
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', {
        zlib: { level: 9 }
      });

      return new Promise((resolve, reject) => {
        output.on('close', () => {
          const fileStream = fs.createReadStream(zipPath);
          const response = new NextResponse(fileStream, {
            headers: {
              'Content-Type': 'application/zip',
              'Content-Disposition': 'attachment; filename=articles.zip',
            },
          });
          resolve(response);
        });

        archive.on('error', (err) => {
          reject(NextResponse.json({ error: err.message }, { status: 500 }));
        });

        archive.pipe(output);
        archive.directory(outputDir, false);
        archive.finalize();
      });
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    const outputPath = '/tmp/output.md';

    try {
      await execAsync(`python3 ${scriptPath} "${url}" "${outputPath}"`);
      const markdown = fs.readFileSync(outputPath, 'utf-8');
      return NextResponse.json({ markdown });
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
