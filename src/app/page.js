'use client';
import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
    const [urls, setUrls] = useState(['']);
    const [markdown, setMarkdown] = useState([]);
    const [error, setError] = useState(null);

    const handleUrlChange = (index, value) => {
        const newUrls = [...urls];
        newUrls[index] = value;
        setUrls(newUrls);
    };

    const handleAddUrl = () => {
        setUrls([...urls, '']);
    };

    const handleSubmit = async (e, convertAll = false) => {
        e.preventDefault();
        setMarkdown([]);
        setError(null);

        if (convertAll) {
            const res = await fetch('/api/convert-all', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url: urls[0], convertAll })
            });

            if (!res.ok) {
                const error = await res.json();
                setError(error.error);
                return;
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'articles.zip';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } else {
            const convertedMarkdown = [];

            for (const url of urls) {
                if (!url.trim()) continue;

                const res = await fetch('/api/convert', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ url })
                });

                if (!res.ok) {
                    const error = await res.json();
                    setError(error.error);
                    return;
                }

                const result = await res.json();
                convertedMarkdown.push(result.markdown);
            }

            setMarkdown(convertedMarkdown);
        }
    };

    return (
        <div className={styles.container}>
            <h1>Substack to Markdown Converter</h1>
            <form onSubmit={(e) => handleSubmit(e, false)}>
                {urls.map((url, index) => (
                    <div key={index}>
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => handleUrlChange(index, e.target.value)}
                            placeholder="Enter Substack URL"
                            required
                        />
                    </div>
                ))}
                <div className={styles.buttonContainer}>
                    <button type="button" onClick={handleAddUrl}>
                        Add URL
                    </button>
                    <button type="submit">Convert</button>
                    <button type="button" onClick={(e) => handleSubmit(e, true)}>Convert All</button>
                </div>
            </form>
            {error && <p style={{color: 'red'}}>{error}</p>}
            {markdown.length > 0 && (
                <div className={styles['markdown-container']}>
                    <h2>Markdown Output</h2>
                    {markdown.map((content, index) => (
                        <div key={index}>
                            <textarea value={content} readOnly rows="20" cols="100"></textarea>
                            <a
                                href={`data:text/markdown;charset=utf-8,${encodeURIComponent(content)}`}
                                download={`output-${index}.md`}
                            >
                                <button>Download</button>
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
