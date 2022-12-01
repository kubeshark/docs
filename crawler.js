import frontmatter from '@github-docs/frontmatter'
import fs from 'fs'
import {remark} from 'remark'
import strip from 'strip-markdown'

let results = []

function readFiles(dirname, onFileContent, onError, onFinish) {
  fs.readdir(dirname, function(err, filenames) {
    if (err) {
      onError(err);
      return;
    }

		let ctr = 0;
		let final = false
    filenames.forEach(function(filename) {
      fs.readFile(dirname + filename, 'utf-8', function(err, fileContent) {
        if (err) {
          onError(err);
          return;
        }

				ctr++;
				if (ctr === filenames.length) {
					final = true;
				}
				onFileContent(fileContent, onFinish, final);
      });
    });

  });
}

function runFrontMatter(fileContent, onFinish, final) {
	const { data, content, errors } = frontmatter(fileContent)

	if (errors.length > 0) {
		logError(errors)
		return;
	}

	remark()
		.use(strip)
		.process(content)
		.then((file) => {
			let text = String(file)
			text = text.replace(/\n/g, " ")
			results.push(
				{
					"title": data.title,
					"description": data.description,
					"content": text,
				}
			)
			if (final) onFinish();
		})
}

function logError(err) {
	console.error(err)
}

function finish() {
	console.log(JSON.stringify(results))
	// console.log(results.length)
}

readFiles("src/pages/en/", runFrontMatter, logError, finish)
