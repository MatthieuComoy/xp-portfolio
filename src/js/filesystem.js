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
                            '4.webp': { type: 'image', title: 'Photo 1', src: '/images/Photos/4.webp' },
                            '5.webp': { type: 'image', title: 'Photo 2', src: '/images/Photos/5.webp' },
                            '6.webp': { type: 'image', title: 'Photo 3', src: '/images/Photos/6.webp' },
                            '7.webp': { type: 'image', title: 'Photo 4', src: '/images/Photos/7.webp' },
                            '8.webp': { type: 'image', title: 'Photo 5', src: '/images/Photos/8.webp' },
                            '9.webp': { type: 'image', title: 'Photo 6', src: '/images/Photos/9.webp' },
                            '21.webp': { type: 'image', title: 'Photo 7', src: '/images/Photos/21.webp' },
                            '22.webp': { type: 'image', title: 'Photo 8', src: '/images/Photos/22.webp' }
                        }
                    },
                    '3d-art': {
                        type: 'folder',
                        title: '3D Art',
                        children: {
                            '15.webp': { type: 'image', title: '3D Art 1', src: '/images/3D art/15.webp' },
                            '16.webp': { type: 'image', title: '3D Art 2', src: '/images/3D art/16.webp' },
                            '17.webp': { type: 'image', title: '3D Art 3', src: '/images/3D art/17.webp' },
                            '18.webp': { type: 'image', title: '3D Art 4', src: '/images/3D art/18.webp' },
                            '19.webp': { type: 'image', title: '3D Art 5', src: '/images/3D art/19.webp' },
                            '20.webp': { type: 'image', title: '3D Art 6', src: '/images/3D art/20.webp' }
                        }
                    },
                    'drawings': {
                        type: 'folder',
                        title: 'Drawings',
                        children: {
                            '1.webp': { type: 'image', title: 'Drawing 1', src: '/images/Drawings/1.webp' },
                            '2.webp': { type: 'image', title: 'Drawing 2', src: '/images/Drawings/2.webp' },
                            '11.webp': { type: 'image', title: 'Drawing 3', src: '/images/Drawings/11.webp' },
                            '14.webp': { type: 'image', title: 'Drawing 4', src: '/images/Drawings/14.webp' }
                        }
                    }
                }
            }
        }
    }
};
