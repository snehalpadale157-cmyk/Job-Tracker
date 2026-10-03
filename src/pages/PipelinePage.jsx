import React from 'react';
import { useJobs } from '../context/JobContext';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const columns = ['Wishlist', 'Applied', 'Screening', 'Interview', 'Offer', 'Rejected', 'Withdrawn'];

export const PipelinePage = () => {
  const { jobs, updateJob } = useJobs();

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    if (source.droppableId !== destination.droppableId) {
      updateJob(draggableId, { status: destination.droppableId });
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <h2 className="text-2xl font-bold mb-4">Pipeline</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 h-full" style={{ overflowX: 'auto', paddingBottom: '1rem' }}>
          {columns.map(col => {
            const colJobs = jobs.filter(j => j.status === col);
            return (
              <Droppable key={col} droppableId={col}>
                {(provided) => (
                  <div 
                    ref={provided.innerRef} 
                    {...provided.droppableProps}
                    className="card p-4" 
                    style={{ minWidth: '280px', backgroundColor: 'var(--bg-tertiary)', border: 'none' }}
                  >
                    <div className="font-bold mb-4 flex justify-between">
                      {col} <span className="badge badge-withdrawn">{colJobs.length}</span>
                    </div>
                    <div className="flex flex-col gap-3">
                      {colJobs.map((job, index) => (
                        <Draggable key={job.id} draggableId={job.id} index={index}>
                          {(provided) => (
                            <div 
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="card p-3 shadow-md"
                            >
                              <div className="font-medium text-sm">{job.jobTitle}</div>
                              <div className="text-xs text-secondary mb-2">{job.companyName}</div>
                              {job.priority === 'High' && <span className="badge badge-screening" style={{fontSize: '0.65rem'}}>High Priority</span>}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};
