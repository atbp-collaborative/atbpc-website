'use client';

import React, { useState } from 'react';
import { ProposalFormData } from '@/lib/forms/proposal';
import { TextField } from '@/components/forms/form-fields/TextField';
import { SelectField } from '@/components/forms/form-fields/SelectField';
import { Button } from '@/components/primitives/Button';
import { Plus, Trash2, Info } from 'lucide-react';

interface Props {
  formData: ProposalFormData;
  updateField: (field: keyof ProposalFormData, value: any) => void;
  isDarkMode: boolean;
}

export const Step1Contact: React.FC<Props> = ({ formData, updateField, isDarkMode }) => {
  const [personToDelete, setPersonToDelete] = useState<{ field: 'principalDecisionMakers' | 'authorizedRepresentatives', index: number } | null>(null);

  const confirmRemove = () => {
    if (!personToDelete) return;
    const { field, index } = personToDelete;
    const list = formData[field] || [{}];
    const newList = list.filter((_, i) => i !== index);
    updateField(field, newList.length > 0 ? newList : [{}]);
    setPersonToDelete(null);
  };

  const renderPersonList = (field: 'principalDecisionMakers' | 'authorizedRepresentatives', label: string, max: number = 2, personPrefix: string) => {
    // Filter out extra completely empty persons to prevent them from showing up due to local storage, but keep at least 1
    const rawList = formData[field] || [{}];
    const list = rawList.filter((person, idx) => {
      if (idx === 0) return true;
      return Object.values(person).some(v => v && typeof v === 'string' && v.trim() !== '');
    });
    // If we filtered out items, we ideally should update the form state, but for rendering this is fine.

    const handleUpdate = (index: number, key: string, value: string) => {
      const newList = [...list];
      newList[index] = { ...newList[index], [key]: value };
      updateField(field, newList);
    };

    const handleAdd = () => {
      if (list.length < max) {
        updateField(field, [...list, {}]);
      }
    };

    const handleRemoveClick = (index: number) => {
      const person = list[index];
      const hasValues = Object.values(person).some(v => v && typeof v === 'string' && v.trim() !== '');
      if (hasValues) {
        setPersonToDelete({ field, index });
      } else {
        const newList = list.filter((_, i) => i !== index);
        updateField(field, newList.length > 0 ? newList : [{}]);
      }
    };

    return (
      <div className="mb-10">
        <h3 className="font-sans text-caption font-bold mb-4 flex justify-between items-center">
          {label}
        </h3>
        {field === 'authorizedRepresentatives' && (
          <div className={`mb-6 p-4 rounded-lg flex gap-3 ${isDarkMode ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-50 text-blue-800'}`}>
            <Info size={20} className="shrink-0 mt-0.5" />
            <p className="text-caption">Reminder: You will be required to submit an SPA (Special Power of Attorney) on the next step. Please prepare your PDF file.</p>
          </div>
        )}
        
        {list.map((person, i) => (
          <div key={i} className="mb-8 relative">
            {i > 0 && (
              <button 
                type="button"
                onClick={() => handleRemoveClick(i)}
                className="absolute top-0 right-0 text-red-500 hover:text-red-700 transition-colors"
                title={`Remove ${personPrefix.toLowerCase()}`}
              >
                <Trash2 size={18} />
              </button>
            )}
            <h4 className="font-sans font-medium text-mini mb-4 opacity-70 uppercase tracking-widest">
              {personPrefix} {list.length > 1 ? i + 1 : ''}
            </h4>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <TextField 
                name="firstName" label="Given Name" 
                value={person.firstName || ''} onChange={(_, val) => handleUpdate(i, 'firstName', val)} 
                isDarkMode={isDarkMode} 
              />
              <TextField 
                name="middleName" label="Middle Name" 
                value={person.middleName || ''} onChange={(_, val) => handleUpdate(i, 'middleName', val)} 
                isDarkMode={isDarkMode} 
              />
              <TextField 
                name="lastName" label="Last Name" 
                value={person.lastName || ''} onChange={(_, val) => handleUpdate(i, 'lastName', val)} 
                isDarkMode={isDarkMode} 
              />
              <TextField 
                name="title" label="Title / Suffix / Prefix" 
                value={person.title || ''} onChange={(_, val) => handleUpdate(i, 'title', val)} 
                isDarkMode={isDarkMode} 
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <TextField 
                type="tel" name="contactNo" label="Contact No." 
                value={person.contactNo || ''} onChange={(_, val) => handleUpdate(i, 'contactNo', val)} 
                isDarkMode={isDarkMode} 
              />
              <TextField 
                type="email" name="email" label="Email Address" 
                value={person.email || ''} onChange={(_, val) => handleUpdate(i, 'email', val)} 
                isDarkMode={isDarkMode} 
              />
              <div className="md:col-span-2">
                <TextField 
                  name="address" label="Current Address" 
                  value={person.address || ''} onChange={(_, val) => handleUpdate(i, 'address', val)} 
                  isDarkMode={isDarkMode} 
                />
              </div>
            </div>
          </div>
        ))}
        
        {list.length < max && (
          <button
            type="button"
            onClick={handleAdd}
            className={`mt-2 py-2 px-6 rounded-xl border text-caption font-medium transition-all hover:opacity-80 flex items-center space-x-2 ${isDarkMode ? 'border-bright-gray/30 bg-vintage-charcoal/50 text-white' : 'border-vintage-charcoal/30 bg-white/60 text-vintage-charcoal'}`}
          >
            <Plus size={16} />
            <span>Add another {personPrefix}</span>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="mb-8">
        <h2 className="font-sans text-body font-bold text-space-sparkle mb-2">Step 1. Contact Information</h2>
        <p className="text-caption opacity-60">Please provide the details for the principal decision makers and authorized representatives.</p>
      </div>

      <div className="mb-10 w-full">
        <h3 className="font-sans text-caption font-bold mb-4">1a. About the Client</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:items-center">
          <label className="text-caption font-semibold block opacity-90 lg:pr-4">
            Will the project be named after a business or a private entity?
          </label>
          <div className="w-full">
            <SelectField
              name="businessEntity"
              placeholder="[ Select Client Type ]"
              options={[
                { value: 'Private Entity', label: 'Private Entity' },
                { value: 'Business', label: 'Business' }
              ]}
              value={formData.businessEntity || ''}
              onChange={(name, val) => updateField('businessEntity', val)}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      </div>

      {renderPersonList('principalDecisionMakers', '1b. Principal Decision Maker', 3, 'Decision Maker')}
      {formData.businessEntity === 'Business' && renderPersonList('authorizedRepresentatives', '1c. Authorized Representative', 1, 'Representative')}

      {personToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className={`w-full max-w-sm p-6 rounded-2xl ${isDarkMode ? 'bg-vintage-charcoal border border-bright-gray/20' : 'bg-white border border-vintage-charcoal/20'}`}>
            <h3 className="font-bold text-lg mb-2">Confirm Deletion</h3>
            <p className="mb-6 opacity-80 text-sm">Are you sure you want to remove this person? All their details will be lost.</p>
            <div className="flex justify-end gap-3">
              <Button type="outline" onClick={() => setPersonToDelete(null)} label="Cancel" />
              <Button type="filled" onClick={confirmRemove} label="Delete" className="bg-red-500 hover:bg-red-600 border-red-500" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
