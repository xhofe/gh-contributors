# gh-contributors

Automatically generate an svg with all contributors for your repository.

## Usage

```
https://contrib.nn.ci/api?repo=[user/repo]
```

Or generate online with [gh-contributors](https://contrib.nn.ci/)

The following parameters are available:

- repo: The repository to generate the svg for, e.g. `Xhofe/gh-contributors`, required & multiple;
- cols: Number of avatars per row (default: 12)

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
