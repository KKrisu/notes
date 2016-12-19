import { Tag } from './tag';

export class Note {

    created?: string; // Y-m-d H:i:s
    id?: number;
    opened?: number; // openings counter

    constructor(
        public title: string,
        public status: number = 1, // 0-draft, 1-active, 8-deleted
        public important: number = 0,
        public tags: Tag[] = [],
        public body?: string,
    ) {}
}
