# gh-contributors

Automatically generate an svg with all contributors for your repository.

## Usage

```
https://contrib.nn.ci/api?repo=[user/repo]
```

Or generate online with [gh-contributors](https://contrib.nn.ci/)

The following parameters are available:

- repo: The repository to generate the svg for, e.g. `xhofe/gh-contributors`, required & multiple;
- cols: Number of avatars per row (default: 12)
- pages: Number of pages to generate per repo (default: 1), 100 contributors per page
- radius: The radius of the avatars (default: 32)
- space: The spacing between avatars (default: 5)
- no_bot: Do not show bots (default: false)
- min_contributions: Only show contributors with at least this number of contributions (default: 0)
- compress: The height/width of each avatar after compression (default: radius \* 4, 0 to disable)

## Example

![Contributors](https://contrib.nn.ci/api?repo=alist-org/alist&repo=alist-org/alist-web&repo=alist-org/docs)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
