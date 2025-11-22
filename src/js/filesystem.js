export const fileSystem = {
    root: {
        type: 'folder',
        children: {
            'graphic-projects': {
                type: 'folder',
                title: 'Graphic Projects',
                children: {
                    'photography': {
                        type: 'folder',
                        title: 'Photography',
                        children: {
                            'photo1.jpg': { type: 'image', title: 'Landscape 1', src: '/images/placeholders/photo1.jpg' },
                            'photo2.jpg': { type: 'image', title: 'Landscape 2', src: '/images/placeholders/photo2.jpg' }
                        }
                    },
                    '3d-art': {
                        type: 'folder',
                        title: '3D Art',
                        children: {
                            'render1.jpg': { type: 'image', title: 'Abstract Render', src: '/images/placeholders/render1.jpg' }
                        }
                    },
                    'drawings': {
                        type: 'folder',
                        title: 'Drawings',
                        children: {
                            'drawing1.jpg': { type: 'image', title: 'Sketch 1', src: '/images/placeholders/drawing1.jpg' }
                        }
                    }
                }
            }
        }
    }
};
